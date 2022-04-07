import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import Web3 from 'web3'
import {displayBn} from '../components/Utils'
import {poolConfigs} from './pool.config'

const hoursMap = {
  '24H': 24,
  '7D': 24 * 7,
  '1M': 24 * 30,
  'MAX': 6000,
}

const {fromWei, toBN} = Web3.utils

const addHours = (hourArrays) => {
  const hoursObj = {}
  hourArrays.forEach(hours => {
    hours.forEach(hour => {
      let hourAcc = hoursObj[hour.id]
      if (hourAcc){
        hourAcc.counter++
        hourAcc.USDTVL = toBN(hourAcc.USDTVL).add(toBN(hour.USDTVL)).toString()
        hourAcc.collateralUSD = toBN(hourAcc.collateralUSD).add(toBN(hour.collateralUSD)).toString()
        hourAcc.liquidations = toBN(hourAcc.liquidations).add(toBN(hour.liquidations)).toString()
        hourAcc.liquidations = toBN(hourAcc.liquidations).add(toBN(hour.liquidations)).toString()
        hourAcc.LPTokenValue = toBN(hourAcc.LPTokenValue).add(toBN(hour.LPTokenValue)).toString()
      } else {
        hourAcc = hour
        hourAcc.counter = 1
      }
      hoursObj[hour.id] = hourAcc
    })
  })
  return Object.values(hoursObj).map(hour=> {
    hour.LPTokenValue = toBN(hour.LPTokenValue).div(toBN(hourArrays.length)).toString()
    return hour
  }).filter(hour => hour.counter === hourArrays.length)
}

class PoolStore {
  switchedOn = false
  apr = "5.55"
  pnl = null
  icon =  ""
  constructor(config) {
    makeAutoObservable(this)
    this.config = config
    this.fetchLastPnl()
    try{
    this.icon = require(`../../public/img/${config.icon}.svg`)
    } catch (e){
      this.icon = null
    }
  }

  toggle = () => {
    mainStore.pools.forEach(pool => pool.switchedOn = false)
    this.switchedOn = !this.switchedOn
    mainStore.refetchData()
  }

  getNormlizedPnl = (rawPnl) => {
    const pnlBaseLine = this.config.pnlBaseLine
    if (rawPnl < pnlBaseLine){
      return 0
    }
    
    return ((( rawPnl / pnlBaseLine) - 1 ) * 100).toFixed(1)
  }

  fetchLastPnl = async () => {
    try{
      const {data} = await axios.post(this.config.apiUrl, { query: `{
        bammHours (first: 1, orderBy: id, orderDirection: desc){
          LPTokenValue
        }
      }`})
      let {bammHours: [lastHour]} = data.data
      lastHour = lastHour || {}
      debugger
      const pnl = parseFloat(fromWei(lastHour.LPTokenValue)) || 0
      runInAction(()=>{
        this.pnl = this.getNormlizedPnl(pnl)
      })
    } catch (err) {
      console.error(err)
    }
  }


}

class MainStore {
  pools = []
  liquidationsHistory = []
  tvlData = []
  tvlImbalanceData = []
  tvlChartScope = '24H'
  tvlSwitch = true
  imbalanceSwitch = true
  liquidationsSwitch = true
  pnlSwitch = true

  liquidationsHistoryFiltterAsset = "Assets" 
  liquidationsHistoryTimeFrame = 10

  loadingLiquidations = true
  loadingTvl = true
  constructor() {
    makeAutoObservable(this)
    this.pools = Object.values(poolConfigs).map(config => new PoolStore(config))
    this.pools[0].switchedOn = true
    this.fetchLiquidations()
    this.fetchTvl()
  }

  get poolsToFetch() {
   return this.pools.filter(p => p.switchedOn)
  }

  get currentPool() {
    return this.poolsToFetch[0]
  }

  toggleSwitch = (switchName) => {
    this[switchName] = !this[switchName]
  }

  setTvlChartScope = timeScope => {
    this.tvlChartScope = timeScope
    this.fetchTvl()
  }

  setLiquidationsHistoryFiltterAsset = ({target}) => {
    this.liquidationsHistoryFiltterAsset = target.value
  }

  setLiquidationsHistoryTimeFrame = ({target}) => {
    this.liquidationsHistoryTimeFrame = target.value
    this.fetchLiquidations()
  }

  refetchData = () => {
    this.fetchLiquidations()
    this.fetchTvl()
  }

  fetchLiquidations = async () => {
    try{
      if(!this.poolsToFetch.length){
        return
      }
      this.loadingLiquidations = true
      const promises = this.poolsToFetch.map(async pool => {
        const hours = this.liquidationsHistoryTimeFrame
        const singlePoolPromises = []
        for (let i = 0; i < hours;  i = i + 1000){
          let query = hours < 1000 ? hours : 1000
          if(hours - i < 1000){
            query = hours - i
          }
          const promise = axios.post(pool.config.apiUrl, { query: `{ liquidationEvents (orderBy: blockNumber, orderDirection: desc, first: ${query}, skip: ${i}){
                id
                debtAmount
                collateralAmount
                blockNumber
                bammId
                date
              }
            }`
          })
          singlePoolPromises.push(promise)
        }
        const results = await Promise.all(singlePoolPromises)
        return results.reduce((a, b) => {
          const {data: {liquidationEvents}} = b.data
          return a.concat(liquidationEvents)
        }, 
        [])

      })
      const liquidations = (await Promise.all(promises)).reduce((a, b) => a.concat(b), [])

      runInAction(()=>{
        this.liquidationsHistory = liquidations
      })
    } catch (err) {
      console.error(err)
    } finally {
      runInAction(()=> this.loadingLiquidations = false)
    }
  }

  fetchTvl = async () => {
    try{
      if(!this.poolsToFetch.length){
        return
      }
      this.loadingTvl = true
      // TODO: store months and fetch months instead 
      const hours = hoursMap[this.tvlChartScope]
      const promises = this.poolsToFetch.map(async pool => {
        const singleBammPromises = []
        for(let i = 0; i < hours; i = i + 1000){
          let query = hours < 1000 ? hours : 1000
          if(hours - i < 1000){
            query = hours - i
          }
          singleBammPromises.push(
            axios.post(pool.config.apiUrl, { query: `{
              bammHours (first: ${query}, orderBy: id, orderDirection: desc, skip: ${i}){
                id
                liquidations
                collateralUSD
                USDTVL
                LPTokenValue
              }
            }`
            })
          )
        }
        const results = await Promise.all(singleBammPromises)
          return results.reduce((a, b) => {
              const {data: {bammHours}} = b.data
              return a.concat(bammHours)
            }, 
            [])
            .map(o => {
              o.pnlBaseLine = pool.config.pnlBaseLine
              return o
            })
      })
      const tvls = addHours(await Promise.all(promises))
      const parsedData = tvls.map(o=> {
          o.tvl = parseInt(fromWei(o.USDTVL).split('.')[0])
          o.imbalance = parseInt(fromWei(o.collateralUSD).split('.')[0])
          o.liquidations = parseInt(fromWei(o.liquidations).split('.')[0])
          o.pnl = parseFloat(fromWei(o.LPTokenValue)).toFixed(2)
          o.date = o.id * 60 * 60
          return o
        })
        .reverse()
      runInAction(()=>{
        this.tvlData = parsedData
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.loadingTvl = false
    }
  }

}

const mainStore = new MainStore

export default mainStore