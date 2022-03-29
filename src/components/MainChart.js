import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import {DisplayBn} from './Utils'
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ReferenceArea, ReferenceLine, ReferenceDot,
  LabelList, Label } from 'recharts'

import mainStore from '../stores/main.store';

const containerStyles = {height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}

const tickIntervalMap = {
  '24H': 1,
  '7D': 24,
  '1M': 48,
  '1Y': 24 * 30,
}

const daysOfTheWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const monthsOfTheYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const TooltipTemplate = styled.div`
  padding: 20px;
  background: rgba(33, 91, 143, 0.04);
  backdrop-filter: blur(13px);
  border-radius: 12px;
`

const StyledLabel = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: red;
  /* color: #3E4954; */
`

const CustomizedLabel = ({value}) => <StyledLabel>{value}</StyledLabel>

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
  &:before{
    content: "${({val})=> val}";
  }
  ${({val, scope})=> val === scope ? "color: #1CAC70;" : ""}
`

const ChartHeaderContainer = styled.div`
  margin-bottom: 20px;
`

const dateFormatter = (tickItem)=> {
  const {tvlChartScope} = mainStore
  let date = new Date(tickItem * 1000)
  if(tvlChartScope === '24H'){
    date = date.getHours() + ':00'
  }
  if(tvlChartScope === '7D'){
    date = daysOfTheWeek[date.getDay()]
  }
  if(tvlChartScope === '1M' ){
    date = date.getDate() + '/' + date.getMonth()
  }                   
  if(tvlChartScope === '1Y'){
    date = monthsOfTheYear[date.getMonth()]
  }          

  debugger
  return date
}

const ChartHeader = observer(() => {
  const {tvlChartScope: scope, setTvlChartScope} = mainStore
  const timeOptions = ['24H', '7D', '1M', '1Y']
  return (
    <ChartHeaderContainer>
      <Flex justifyBetween>
        <ChartTitle>Total Value Locked</ChartTitle>
        <Flex justifyAround style={{minWidth: '40%'}}>
          {timeOptions.map(t=> <ChartHeaderButton val={t} scope={scope} onClick={() => setTvlChartScope(t)}/>)}
        </Flex>
      </Flex>
    </ChartHeaderContainer>
  )
})

function MainChart (props) {
  const data = mainStore.tvlData
  const interval = tickIntervalMap[mainStore.tvlChartScope]
  if(!data.length){
    return <article style={containerStyles} aria-busy="true"></article>
  }
  return (
    <article>
      <ChartHeader/>
      <AreaChart baseValue={0}  width={800} height={300} data={data} syncId="anyId">
        <defs>
          <linearGradient id="MyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(19, 194, 101, 0.8)" />
            <stop offset="95%" stopColor="rgba(19, 194, 101, 0)" />
          </linearGradient>          
          <linearGradient id="MyGradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(172, 76, 188, 0.8)" />
            <stop offset="95%" stopColor="rgba(172, 76, 188, 0)" />
          </linearGradient>          
          <linearGradient id="MyGradient3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(72, 146, 254, 0.8)" />
            <stop offset="95%" stopColor="rgba(72, 146, 254, 0)" />
          </linearGradient>          
          <linearGradient id="MyGradient4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(255, 86, 157, 0.8)" />
            <stop offset="95%" stopColor="rgba(255, 86, 157, 0)" />
          </linearGradient>
        </defs>

        <YAxis hide={true} type="number" domain={['dataMin -10000', 'dataMax + 10000']} />
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
        <Area
          type="monotone"
          dataKey="imbalance"
          stroke="rgb(172, 76, 188)"
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#MyGradient2)"
        />        
        <Area
          type="monotone"
          dataKey="liquidations"
          stroke="rgba(72, 146, 254, 1)"
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#MyGradient3)"
        />        
      </AreaChart>
    <AreaChart baseValue={0}  width={800} height={50} data={data} syncId="anyId">
        <defs>
          <linearGradient id="MyGradient4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(255, 86, 157, 0.8)" />
            <stop offset="95%" stopColor="rgba(255, 86, 157, 0)" />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          tick={{fontSize: 11, fill: '#3E4954'}}
          scale="time"
          type="number"
          domain={[data[0].date, data[data.length - 1].date]}
          tickFormatter={dateFormatter}
          interval={interval}
          >
        </XAxis>
      <Area
          type="monotone"
          dataKey="pnl"
          stroke="rgba(255, 86, 157, 1)"
          strokeWidth="2"
          fillOpacity="1"
          fill="url(#MyGradient4)"
        />
      </AreaChart>
    </article>
  )
}

export default observer(MainChart)