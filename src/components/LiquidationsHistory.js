import styled from 'styled-components'
import { observer } from "mobx-react"
import Flex, { FlexItem } from 'styled-flex-component';
import {SectionTitle} from './styleComponents'
import {DisplayBn} from './Utils'
import mainStore from '../stores/main.store'
import { poolConfigs as _poolConfigs} from '../stores/pool.config';

const poolConfigs = Object.fromEntries(Object.entries(_poolConfigs).map(([k, v])=> [k.toLocaleLowerCase(), v])) // lowerCasing keys (BAMM address)

const Container = styled.div`
  th {
    padding: 0;
    height: 38px;
  }
  td{
    padding: 0;
    height: 60px;
  }
  th, td{
    border: none;
    background: #FFFFFF;
    box-shadow: -24px 0px 80px rgba(49, 79, 124, 0.02);
  }
  th:first-child, td:first-child {
    border-radius: 12px 0 0 12px;
  }
  th:last-child, td:last-child {
    border-radius: 0 12px 12px 0;
  }
  table{
    border-collapse:separate; 
    border-spacing:0 15px;
  }
`

const MutedText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 30px;
  color: #848CA9;
  height: 30px;
  padding: 0 30px;
  border-left: ${({first})=> !first ? "1px solid #ECEFF9" : ""};
`

const TdText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 45px;
  color: #3F4765;
  height: 45px;
  padding: 0 30px;
  border-left: ${({first})=> !first ? "1px solid #ECEFF9" : ""};
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TdLink = styled.a`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 45px;
  color: #3F4765;
  height: 45px;
  padding: 0 30px;
  border-left: ${({first})=> !first ? "1px solid #ECEFF9" : ""};
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Liquidation = observer(({data}) => {
  const {debtAmount, collateralAmount,
     blockNumber, bammId, date, id} = data
  // TODO missing data txHash collateralAsset debtAsset liquidationRatio
  const parsedDate = new Date(date * 1000).toLocaleDateString()
  const pool = poolConfigs[bammId.toLocaleLowerCase()]
  if(!pool){
    console.error(`failed to find pool: "${bammId}"`)
    return null
  }
  const collateralAsset = pool.collateral
  const debtAsset = pool.coin
  if(mainStore.liquidationsHistoryFiltterAsset !== 'Assets' && mainStore.liquidationsHistoryFiltterAsset != collateralAsset){
    return null
  }
  const multipleCollateral = collateralAsset === 'multiple'
  const [txHash,] = id.split(';')
  const url = pool.blockExplorer + 'tx/' + txHash
  return (
    <tr className="fade-in-top">
      <td><TdText first={true}>{parsedDate}</TdText></td>
      <td><TdText>{pool.network}</TdText></td>
      <td><TdText>{pool.name}</TdText></td>
      <td><TdText>{bammId}</TdText></td>
      {!multipleCollateral &&
        <td><TdText><DisplayBn bn={collateralAmount}/> {collateralAsset}</TdText></td>
      }      
      {multipleCollateral &&
        <td><TdText> Multiple Collateral Types</TdText></td>
      }
      <td><TdText><DisplayBn bn={debtAmount}/> {debtAsset}</TdText></td>

      <td><TdLink href={url} target="_blank">{id}</TdLink></td>
    </tr> 
  )
})

const LSText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #5E6990;

  margin: 0 20px 0 0px;
  white-space: nowrap;
`

const Select = styled.select`
  width: 100px;
  height: 32px;

  background: #FFFFFF;

  box-shadow: 0px 12px 23px rgba(62, 73, 84, 0.04);
  border-radius: 48px;
  margin: 0 20px 0 0px;
  padding: 0 30px 0 10px !important;
  background-position: center right 5px!important;
  font-style: normal;

  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: #5E6991;
  option{
    text-align: center;
  }
`

const Selector = observer(({options, onChange}) => {
  return (
    <Select defaultValue={options[0]} options={options} onChange={onChange}>
        {options.map(({value, label}, i) => <option key={i} value={value} >{label}</option>)}
    </Select>
  )
})

const timeOptions = [
  {
    label: "Last 10",
    value: 10
  },
  {
    label: "Last 100",
    value: 100
  },
  {
    label: "Last 300",
    value: 1000
  },
  {
    label: "max",
    value: 6000
  },
]

const assetOptions = [{ label: "Assets", value: "Assets" }]
const collateralTypes = [...new Set(Object.values(poolConfigs)
  .filter(({comingSoon}) => !comingSoon)
  .map(({collateral})=> collateral))]
collateralTypes.forEach(c=> assetOptions.push({label: c, value: c}))
const {setLiquidationsHistoryFiltterAsset, setLiquidationsHistoryTimeFrame} = mainStore
const LiquidationsSelector = () => {
  return (
    <Flex justifyBetween alignCenter>
      <LSText>See ALL</LSText>
      <Selector options={assetOptions} onChange={setLiquidationsHistoryFiltterAsset}/>
      <LSText>In</LSText>
      <Selector options={timeOptions} onChange={setLiquidationsHistoryTimeFrame}/>
    </Flex>
  )
}

function LiquidationsHistory () {
  const liquidations = mainStore.liquidationsHistory
  return (
    <Container>
      <Flex justifyBetween alignCenter>
        <SectionTitle aria-busy={mainStore.loadingLiquidations}>Liquidations history</SectionTitle>
        <LiquidationsSelector/>
      </Flex>
      {!!liquidations.length && <table>
        <thead>
          <tr>
            <th><MutedText first={true}>DATE</MutedText></th>
            <th><MutedText>NETWORK</MutedText></th>
            <th><MutedText>PLATFORM</MutedText></th>
            <th><MutedText>BAMM ADDRESS </MutedText></th>
            <th><MutedText>COLLATERAL</MutedText></th>
            <th><MutedText>DEBT</MutedText></th>
            <th><MutedText>TRANSACTION</MutedText></th>
          </tr>
        </thead>
        <tbody>
          {liquidations.map((liq, i)=> <Liquidation key={i} data={liq}/>)}
        </tbody>
      </table>
      }
      {!liquidations.length && !mainStore.loadingLiquidations && <SectionTitle className="fade-in-top" style={{textAlign: 'center', padding: '50px'}}>No Liquidations Yet</SectionTitle>}
    </Container>
  )
}

export default observer(LiquidationsHistory)