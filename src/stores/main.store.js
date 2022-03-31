import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import Web3 from 'web3'
import {displayBn} from '../components/Utils'

const hoursMap = {
  '24H': 24,
  '7D': 24 * 7,
  '1M': 24 * 30,
  '1Y': 6000,
}

const {fromWei, toBN} = Web3.utils

export const poolConfigs = {
  "0xebf8252756268091e523e57d293c0522b8afe66b": {
    name: "Vesta",
    network: "Arbitrum",
    blockExplorer: "https://arbiscan.io",
    coin: "VST",
    collateral: "gOHM",
    apiUrl: "https://api.thegraph.com/subgraphs/name/shmuel-web/bprotocol-vesta-gohm",
  }
}

class PoolStore {
  switchedOn = true
  apr = "5.55"
  aprChange = "1.1"
  icon =  ""
  constructor(config) {
    makeAutoObservable(this)
    this.config = config
    this.icon = require(`../../public/img/${config.name}.svg`)
  }

  toggle = () => {
    this.switchedOn = !this.switchedOn
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
  liquidationsHistoryTimeFrame = 24
  constructor() {
    makeAutoObservable(this)
    this.pools = Object.values(poolConfigs).map(config => new PoolStore(config))
    this.fetchLiquidations()
    this.fetchTvl()
  }

  get poolsToFetch() {
   return this.pools.filter(p => p.switchedOn)
  }

  toggleSwitch = (switchName) => {
    this[switchName] = !this[switchName]
  }

  setTvlChartScope = timeScope => {
    this.tvlChartScope = timeScope
    this.fetchTvl()
  }

  setLiquidationsHistoryFiltterAsset = ({target}) => {
    debugger
    this.liquidationsHistoryFiltterAsset = target.value
  }

  setLiquidationsHistoryTimeFrame = ({target}) => {
    debugger
    this.liquidationsHistoryTimeFrame = target.value
  }

  fetchLiquidations = async () => {
    try{
      const promises = this.poolsToFetch.map(pool => {
        return axios.post(pool.config.apiUrl, { query: `{ liquidationEvents (orderBy: blockNumber, orderDirection: desc, first: 10){
              id
              debtAmount
              collateralAmount
              txHash
              blockNumber
              bammId
              date
            }
          }`
        })
      })
      const unifiedData = {}
      const dataSets = await Promise.all(promises)
      dataSets.forEach(ds=> {
        const {data} = ds.data
        for(const key in data) {
          unifiedData[key] = unifiedData[key] || []
          unifiedData[key] = unifiedData[key].concat(data[key])
        }
      })
      runInAction(()=>{
        this.liquidationsHistory = unifiedData.liquidationEvents
      })
    } catch (err) {
      console.error(err)
    }
  }

  fetchTvl = async () => {
    try{
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
      })
      const [tvls] = await Promise.all(promises)
      const parsedData = tvls.map(o=> {
          o.tvl = parseInt(fromWei(o.USDTVL).split('.')[0])
          o.imbalance = parseInt(fromWei(o.collateralUSD).split('.')[0])
          o.liquidations = parseInt(fromWei(o.liquidations).split('.')[0])
          o.pnl = parseInt(fromWei(o.LPTokenValue).split('.')[0]) * 10000
          o.date = new Date(o.id * 60 * 60 * 1000)
          o.date = o.id * 60 * 60
          return o
        })
        .reverse()
      runInAction(()=>{
        this.tvlData = parsedData
      })
    } catch (err) {
      console.error(err)
    }
  }

}

const mainStore = new MainStore

export default mainStore