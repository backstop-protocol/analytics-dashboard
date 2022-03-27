import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import {DisplayBn} from './Utils'
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ReferenceArea, ReferenceLine, ReferenceDot,
  LabelList, Label } from 'recharts'

import mainStore from '../stores/main.store';

const container = {height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}

const TooltipTemplate = styled.div`
  padding: 20px;
  background: rgba(33, 91, 143, 0.04);
  backdrop-filter: blur(13px);
  border-radius: 12px;
`

const CustomTooltipTitle = styled.div`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 21px;
color: #676767;
`

const CustomTooltipSubTitle = styled.div`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 21px;
color: #979797;
`

const CustomTooltipValue = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`
 
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null
  }
  return (
    <TooltipTemplate className="custom-tooltip">
      <CustomTooltipTitle>{label}</CustomTooltipTitle>
      <Flex column>
        <CustomTooltipSubTitle>TVL</CustomTooltipSubTitle>
        <CustomTooltipValue>{payload[0].value}</CustomTooltipValue>
      </Flex>
    </TooltipTemplate>
  );
}

const ChartTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: #3F4765;
`

const ChartHeaderButton = styled.div`
  border: 1px solid #E5EBEF;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 1px 4px; 

  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #9FA8C7;
  &:hover{
    background-color: rgba(19, 194, 101, 0.2);
    transition: background-color 0.3s ease-in-out;
  }
  &.active {
    color: #1CAC70;
  }
`

const ChartHeaderContainer = styled.div`
  margin-bottom: 20px;
`

function ChartHeader () {
  return (
    <ChartHeaderContainer>
      <Flex justifyBetween>
        <ChartTitle>Total Value Locked</ChartTitle>
        <Flex justifyAround style={{minWidth: '40%'}}>
          <ChartHeaderButton>24H</ChartHeaderButton>
          <ChartHeaderButton>7D</ChartHeaderButton>
          <ChartHeaderButton>1M</ChartHeaderButton>
          <ChartHeaderButton>1Y</ChartHeaderButton>
        </Flex>
      </Flex>
    </ChartHeaderContainer>
  )
}


function MainChart (props) {
  if(!mainStore.tvlData.length){
    return <article style={container} aria-busy="true"></article>
  }
  return (
    <article>
      <ChartHeader/>
      <AreaChart width={800} height={400} data={mainStore.tvlData}
      >
        <defs>
          <linearGradient id="MyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(19, 194, 101, 0.8)" />
            <stop offset="95%" stopColor="rgba(19, 194, 101, 0)" />
          </linearGradient>
        </defs>
        <XAxis dataKey="date">
          {/* <Label position="insideBottom" value="province" /> */}
        </XAxis>
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
        <Area
          type="monotone"
          dataKey="tvl"
          stroke="rgba(19, 194, 101)"
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#MyGradient)"
        />
      </AreaChart>
    </article>
  )
}

export default observer(MainChart)