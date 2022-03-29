import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import Web3 from 'web3'
import {displayBn} from '../components/Utils'

const hoursMap = {
  '24H': 24,
  '7D': 24 * 7,
  '1M': 24 * 30,
  '1Y': 1000,
}

const {fromWei, toBN} = Web3.utils

const poolConfigs = [
  {
    name: "Vesta",
    network: "Arbitrum",
    coin: "VST",
    collateral: "gOHM",
    apiUrl: "https://api.thegraph.com/subgraphs/name/yaronvel/b-vesta-gohm",
  }
]

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
  constructor() {
    makeAutoObservable(this)
    this.pools = poolConfigs.map(config => new PoolStore(config))
    this.fetchLiquidations()
    this.fetchTvl()
  }

  get poolsToFetch() {
   return this.pools.filter(p => p.switchedOn)
  }

  setTvlChartScope = timeScope => {
    this.tvlChartScope = timeScope
    this.fetchTvl()
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
      const promises = this.poolsToFetch.map(pool => {
        if (hours > 1000){
          const singleBammPromises = []
          for(let i = 0; i < hours; i = i + 1000){
            debugger
            let query = (i + 1000) > hours ? hours : (i + 1000)
            singleBammPromises.push(
              axios.post(pool.config.apiUrl, { query: `{
                historicalBAMMVestaDatas (first: ${query}, orderBy: id, orderDirection: desc, skip: ${i}){
                  id
                  gohmLiquidations
                  gohmCollateralUSD
                  gohmUSDTVL
                }
              }`
              })
            )
          }
          return Promise.all(singleBammPromises)
            .then(results => {
              debugger
              return results.reduce((a, b) => a.concat(b), [])
            })
        }
        return axios.post(pool.config.apiUrl, { query: `{
          historicalBAMMVestaDatas (first: ${hours}, orderBy: id, orderDirection: desc){
            id
            gohmLiquidations
            gohmCollateralUSD
            gohmUSDTVL
            gohmLPTokenValue
          }
        }`
        })
      })
      const unifiedData = {}
      const dataSets = await Promise.all(promises)
      debugger
      dataSets.forEach(ds=> {
        const {data} = ds.data
        for(const key in data) {
          unifiedData[key] = unifiedData[key] || []
          unifiedData[key] = unifiedData[key].concat(data[key])
        }
      })
      runInAction(()=>{
        this.tvlData = unifiedData.historicalBAMMVestaDatas
        .map(o=> {
          o.tvl = parseInt(fromWei(o.gohmUSDTVL).split('.')[0])
          o.imbalance = parseInt(fromWei(o.gohmCollateralUSD).split('.')[0])
          o.liquidations = parseInt(fromWei(o.gohmLiquidations).split('.')[0])
          o.pnl = parseInt(fromWei(o.gohmLPTokenValue).split('.')[0]) * 10000
          o.date = new Date(o.id * 60 * 60 * 1000)
          o.date = o.id * 60 * 60
          return o
        })
        .reverse()

      })
    } catch (err) {
      debugger
      console.error(err)
    }
  }

}

const mainStore = new MainStore

export default mainStore