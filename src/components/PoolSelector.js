import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import SidebarPoolItem from './SidebarPoolItem'
import mainStore from '../stores/main.store'


const MutedTitle = styled.div`
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;

color: #8F98B7;
`

const MutedSubtitle = styled.div`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 24px;

color: #8F98B7;

padding-top: 20px;
`

function PoolSelector () {
  const networks = {
    Ethereum: [],
    Arbitrum: [],
    Fantom: [],
    Polygon: [],
  }
  mainStore.pools.forEach(pool=> {
    networks[pool.config.network].push(pool)
  })

  return (
    <div>
      <Flex column>
        <MutedTitle>SELECT POOLS</MutedTitle>
        {Object.entries(networks).map(([net, pools]) => {
          return <>
            <MutedSubtitle>{net}</MutedSubtitle>
            {pools.map((pool, index) => <SidebarPoolItem key={index} poolStore={pool}/>)}
          </>
        })}
      </Flex>
    </div>
  )
}

export default observer(PoolSelector)