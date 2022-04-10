import Flex from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,} from 'recharts'
import mainStore from '../../stores/main.store';
import {daysOfTheWeek, monthsOfTheYear, colorScheme} from './constants'
import CustomTooltip, {PnlTooltip} from './MainChartTooltip'
import SideLegend from './SideLegend'

const containerStyles = {height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}

const tickIntervalMap = {
  '24H': 1,
  '7D': 24,
  '1M': 48,
  'MAX': 24 * 30,
}

const transperancy = (rgbaString, transperancy) => rgbaString.replace('1)', transperancy + ')')

const ChartTitle = styled.span`
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
  if(tvlChartScope === 'MAX'){
    date = monthsOfTheYear[date.getMonth()]
  }          

  return date
}

const ChartHeader = observer(() => {
  const {tvlChartScope: scope, setTvlChartScope} = mainStore
  const timeOptions = ['24H', '7D', '1M', 'MAX']
  return (
    <ChartHeaderContainer>
      <Flex justifyBetween>
        <ChartTitle aria-busy={mainStore.loadingTvl}>Total Value Locked</ChartTitle>
        <Flex justifyAround style={{minWidth: '40%'}}>
          {timeOptions.map((t, index) => <ChartHeaderButton key={index} val={t} scope={scope} onClick={() => setTvlChartScope(t)}/>)}
        </Flex>
      </Flex>
    </ChartHeaderContainer>
  )
})

function MainChart (props) {
  const data = mainStore.tvlData
  debugger
  const interval = tickIntervalMap[mainStore.tvlChartScope]
  if(!data.length){
    return <article style={containerStyles} aria-busy="true"></article>
  }
  const hideImbalance = !mainStore.imbalanceSwitch || mainStore.currentPool.config.noImbalance
  return (
    <article>
      <ChartHeader/>
      <Flex justifyBetween>
        <div style={{width: '100%'}}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart baseValue={0} data={data} syncId="anyId" >
              <defs>
                <linearGradient id="MyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={transperancy(colorScheme.tvl, 0.8)} />
                  <stop offset="95%" stopColor={transperancy(colorScheme.tvl, 0)} />
                </linearGradient>          
                <linearGradient id="MyGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={transperancy(colorScheme.imbalance, 0.8)} />
                  <stop offset="95%" stopColor={transperancy(colorScheme.imbalance, 0)} />
                </linearGradient>          
                <linearGradient id="MyGradient3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={transperancy(colorScheme.liquidations, 0.8)} />
                  <stop offset="95%" stopColor={transperancy(colorScheme.liquidations, 0)} />
                </linearGradient>          
              </defs>
              <XAxis 
                hide={true}
                dataKey="date" 
                tick={{fontSize: 11, fill: '#3E4954'}}
                scale="time"
                type="number"
                domain={[data[0].date, data[data.length - 1].date]}
                tickFormatter={dateFormatter}
                interval={interval}
                >
              </XAxis>
              <YAxis hide={true} type="number" domain={['dataMin -10000', 'dataMax + 10000']} />
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
              <Area
                hide={!mainStore.tvlSwitch}
                type="monotone"
                dataKey="tvl"
                stroke={colorScheme.tvl}
                strokeWidth="2"
                fillOpacity="1"
                fill="url(#MyGradient)"
              />        
              <Area
                hide={hideImbalance}
                type="monotone"
                dataKey="imbalance"
                stroke={colorScheme.imbalance}
                strokeWidth="2"
                fillOpacity="1"
                fill="url(#MyGradient2)"
              />        
              <Area
                hide={!mainStore.liquidationsSwitch}
                type="monotone"
                dataKey="liquidations"
                stroke={colorScheme.liquidations}
                strokeWidth="2"
                fillOpacity="1"
                fill="url(#MyGradient3)"
              />        
            </AreaChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={50}>
            <AreaChart baseValue={0} data={data} syncId="anyId">
              <defs>
                <linearGradient id="MyGradient4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={transperancy(colorScheme.pnl, 0.8)} />
                  <stop offset="95%" stopColor={transperancy(colorScheme.pnl, 0)} />
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
              <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                  hide={!mainStore.pnlSwitch}
                  type="monotone"
                  dataKey="pnl"
                  stroke={colorScheme.pnl}
                  strokeWidth="2"
                  fillOpacity="1"
                  fill="url(#MyGradient4)"
                />
          </AreaChart>
          </ResponsiveContainer>
        </div>
        <SideLegend/>
      </Flex>
    </article>
  )
}

export default observer(MainChart)