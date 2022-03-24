import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import SidebarPoolItem from './SidebarPoolItem'
import {IconWrapper} from './styleComponents'
import mainStore from '../stores/main.store'


const MutedTitle = styled.div`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 24px;

color: #8F98B7;
`

const MutedLink = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  margin-left: 20px;
  color: #9FA8C7;
`
const CommunityLink = ({text, url}) => {
  let icon
  try{
    icon = require(`../../public/img/${text}.svg`)
  } catch (e) {
    icon = null
  }
  return (
    <a 
      href={url} 
      target="_blank"
      style={{width: "50%", display: "inline-block", margin: "24px 0"}}>
      <Flex alignCenter>
        <IconWrapper>
          <img src={icon}/>
        </IconWrapper>
        <MutedLink>{text}</MutedLink>
      </Flex>
    </a>
  )
}

function PoolSelector () {
  return (
    <div>
      <Flex column>
        <MutedTitle>SELECT POOLS</MutedTitle>
        {mainStore.pools.map((pool, index) => <SidebarPoolItem key={index} poolStore={pool}/>)}
        <MutedTitle>COMMUNITY</MutedTitle>
        <div style={{width: "100%"}}>
          <CommunityLink text="GitHub" url="https://github.com/backstop-protocol"/>
          <CommunityLink text="Twitter" url="https://twitter.com/bprotocoleth"/>
          <CommunityLink text="Medium" url="https://medium.com/b-protocol"/>
          <CommunityLink text="Discord" url="https://discord.com/invite/bJ4guuw"/>
        </div>
      </Flex>
    </div>
  )
}

export default observer(PoolSelector)