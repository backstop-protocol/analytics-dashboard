import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'

const iconWrapperStyle = {
  width: "32px",
  height: "32px",
  border: "1px solid #E7EEEF",
  boxSizing: "border-box",
  borderRadius: "8px"
}

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

function SidebarItem () {
  return (
    <Flex justifyBetween style={{margin: "35px 0"}} >
      <div style={iconWrapperStyle}></div>
      <Flex column>
        <PlatformTitleStyle>
          Liquity
        </PlatformTitleStyle>        
        <PlatformSubTitle>
          LUSD/Mainnet
        </PlatformSubTitle>
      </Flex>
      <Flex column>
        <div>APR</div>
      </Flex>
      <div>
        <input type="checkbox" id="switch" name="switch" role="switch"/>
      </div>
    </Flex>
  )
}

export default SidebarItem;