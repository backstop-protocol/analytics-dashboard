import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import Web3 from 'web3'
import {displayBn} from '../components/Utils'


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
  constructor() {
    makeAutoObservable(this)
    this.pools = poolConfigs.map(config => new PoolStore(config))
    this.fetchLiquidations()
    this.fetchTvl()
  }

  get poolsToFetch() {
   return this.pools.filter(p => p.switchedOn)
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
      const promises = this.poolsToFetch.map(pool => {
        return axios.post(pool.config.apiUrl, { query: `{
          historicalBAMMVestaDatas (first: 24, orderBy: id, orderDirection: desc){
            id
            gohmLiquidations
            gohmCollateralUSD
            gohmUSDTVL
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
        this.tvlData = unifiedData.historicalBAMMVestaDatas.map(o=> {
          o.tvl = displayBn(o.gohmUSDTVL)
          o.date = new Date(o.id * 60 * 60 * 1000).toDateString()
          return o
        })
      })
    } catch (err) {
      console.error(err)
    }
  }

}

const mainStore = new MainStore

export default mainStore