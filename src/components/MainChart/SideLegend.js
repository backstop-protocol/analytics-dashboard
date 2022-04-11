import Flex from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import {colorScheme} from './constants'
import mainStore from '../../stores/main.store';

const LegendTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #676767;

  padding-bottom: 20px;
`

const LegendText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #000000;
  width: 50%;
`

const LegendSwitchContainer = styled.div`
  [type=checkbox][role=switch]:checked {
      --background-color: ${({color})=> color};
      --border-color: ${({color})=> color};
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`

const LegendSwitch = observer(({color, label, name}) => {
  const checked = mainStore[name]
  const hideImbalance = mainStore.currentPool.config.noImbalance
  if (label == "Imbalance" && hideImbalance) {
    return null
  }
  return (
    <LegendSwitchContainer color={color}>
      <LegendText>
        {label}
      </LegendText>
      <input checked={checked} onChange={()=>mainStore.toggleSwitch(name)} type="checkbox" id="switch" name="switch" role="switch"/>
    </LegendSwitchContainer>     
  )
})

const legendItems = [
  {
    label: "Backstop TVL",
    color: colorScheme.tvl, 
    name: "tvlSwitch"
  },
  {
    label: "Liquidations",
    color: colorScheme.liquidations,
    name: 'liquidationsSwitch'
  },
  {
    label: "Imbalance",
    color: colorScheme.imbalance,
    name: 'imbalanceSwitch'
  },
  {
    label: "Backstop LP Token Value",
    color: colorScheme.pnl,
    name: 'pnlSwitch'
  },
]

const SideLegend = ()=> {
  return (
    <article style={{maxWidth: '220px', padding: '20px', background: 'rgba(33, 91, 143, 0.04)', marginRight: '-40px'}}>
      <Flex column>
        <LegendTitle>
          SELECT PARAMETERS TO DISPLAY
        </LegendTitle>
        {legendItems.map(({label, color, name})=> <LegendSwitch key={label} label={label} color={color} name={name}/>)}
      </Flex>
    </article>
  )
}

export default observer(SideLegend)