import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"
import {IconWrapper} from './styleComponents'

const PlatformTitleStyle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #3F4765;
`

const PlatformSubTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 24px;
  color: #9FA8C7;
`

const Apr = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: 0.02em;

  color: #3F4765;
`

const UpOnly = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;

  color: #13C265;
  ${({down})=> {
    if(down){
      return `color: #FF0000E5`
    }
  }}

`

const UpArrow = ()=> <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.71517 0.308609C6.68948 0.250506 6.65158 0.196016 6.60147 0.148574L6.59694 0.144332C6.50043 0.0550934 6.36777 0 6.22137 0H0.877857C0.582743 0 0.343506 0.223858 0.343506 0.5C0.343506 0.776142 0.582743 1 0.877857 1H4.93133L0.500014 5.14645C0.291337 5.34171 0.291337 5.65829 0.500014 5.85355C0.708691 6.04882 1.04702 6.04882 1.2557 5.85355L5.68702 1.70711V5.5C5.68702 5.77614 5.92625 6 6.22137 6C6.51648 6 6.75572 5.77614 6.75572 5.5V0.500346L6.75571 0.497001C6.7553 0.432871 6.74179 0.368801 6.71517 0.308609Z" fill="#13C265"/> </svg> 
const DownArrow = ()=> <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.24107 7.16555C6.29918 7.13986 6.35367 7.10196 6.40111 7.05185L6.40535 7.04732C6.49459 6.9508 6.54968 6.81815 6.54968 6.67175L6.54968 1.32824C6.54968 1.03312 6.32583 0.793884 6.04968 0.793884C5.77354 0.793884 5.54968 1.03312 5.54968 1.32824L5.54968 5.38171L1.40324 0.950392C1.20797 0.741715 0.891391 0.741715 0.696129 0.950392C0.500867 1.15907 0.500867 1.4974 0.696129 1.70608L4.84258 6.1374L1.04968 6.1374C0.77354 6.1374 0.549683 6.37663 0.549683 6.67175C0.549683 6.96686 0.77354 7.2061 1.04968 7.2061L6.04934 7.2061L6.05268 7.20609C6.11681 7.20568 6.18088 7.19217 6.24107 7.16555Z" fill="#FF0000" fill-opacity="0.9"/> </svg>

function SidebarPoolItem ({poolStore}) {
  const down = poolStore.pnl < 0
  return (
    <Flex  justifyBetween alignCenter style={{marginBottom: "20px", marginLeft: "10px"}} >
      <IconWrapper>
        <img src={poolStore.icon} />
      </IconWrapper>
      <Flex column>
        <PlatformTitleStyle>
          {poolStore.config.name}
        </PlatformTitleStyle>        
        <PlatformSubTitle>
          {poolStore.config.collateral} / {poolStore.config.coin}
        </PlatformSubTitle>
      </Flex>
      <Flex column>
        {/* <Apr>{poolStore.apr}% APR</Apr> */}
        <Apr>PnL</Apr>
        {poolStore.pnl && <UpOnly down={down}>
          <span>
            {down && <DownArrow/>}
            {!down && <UpArrow/>}
          </span> {poolStore.pnl}%
        </UpOnly>}
      </Flex>
      <div data-tooltip={poolStore.config.comingSoon ? "coming soon" : null}>
        <input 
          disabled={poolStore.config.comingSoon}
          checked={poolStore.switchedOn} 
          onChange={poolStore.toggle} 
          type="checkbox" 
          id="switch" name="switch" role="switch"/>
      </div>
    </Flex>
  )
}

export default observer(SidebarPoolItem);