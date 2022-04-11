import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import SidebarPoolItem from './SidebarPoolItem'
import mainStore from '../stores/main.store'
import {Fragment} from 'react'


const MutedTitle = styled.div`
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;

color: #8F98B7;
padding-bottom: 20px;
`

const MutedSubtitle = styled.div`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 24px;

color: #8F98B7;

display: inline-block;
`

function PoolSelector () {
  const networks = {
    Ethereum: [],
    Fantom: [],
    Arbitrum: [],
    Polygon: [],
  }
  mainStore.pools.forEach(pool=> {
    networks[pool.config.network].push(pool)
  })

  return (
    <div>
      <Flex column>
        <MutedTitle>SELECT BACKSTOP POOL</MutedTitle>
        {Object.entries(networks).map(([net, pools], i) => {
          return (<Fragment key={net}>
            <details open={i==0}>
              <summary>
                <MutedSubtitle>{net}</MutedSubtitle>
              </summary>
              {pools.map((pool, index) => <SidebarPoolItem key={index} poolStore={pool}/>)}
              </details>
            </Fragment>)
        })}
      </Flex>
    </div>
  )
}

export default observer(PoolSelector)