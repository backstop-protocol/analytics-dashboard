import styled from 'styled-components'
import { observer } from "mobx-react"
import {SectionTitle} from './styleComponents'
import {DisplayBn} from './Utils'
import mainStore from '../stores/main.store'

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
`

const Liquidation = ({data}) => {
  const {debtAmount, collateralAmount, txHash, blockNumber, bammId} = data
  // TODO missing data txHash collateralAsset debtAsset liquidationRatio
  return (
    <tr>
      <td><TdText first={true}>12:59 2022-01-01</TdText></td>
      <td><TdText>{bammId}</TdText></td>
      <td><TdText><DisplayBn bn={collateralAmount}/> ETH</TdText></td>
      <td><TdText><DisplayBn bn={debtAmount}/> LUSD</TdText></td>
      <td><TdText>107.33 %</TdText></td>
      <td><TdText>{txHash}</TdText></td>
    </tr> 
  )
}

function LiquidationsHistory () {
  const liquidations = mainStore.liquidationsHistory
  return (
    <Container>
      <SectionTitle aria-busy={!liquidations.length}>Liquidations history</SectionTitle>
      {!!liquidations.length && <table>
        <thead>
          <tr>
            <th><MutedText first={true}>DATE</MutedText></th>
            <th><MutedText>OWNER</MutedText></th>
            <th><MutedText>COLLATERAL</MutedText></th>
            <th><MutedText>DEBT</MutedText></th>
            <th><MutedText>LIQUIDATION</MutedText></th>
            <th><MutedText>TRANSACTION</MutedText></th>
          </tr>
        </thead>
        <tbody>
          {liquidations.map(liq=> <Liquidation key={liq.txHash} data={liq}/>)}
        </tbody>
      </table>
      }
    </Container>
  )
}

export default observer(LiquidationsHistory)