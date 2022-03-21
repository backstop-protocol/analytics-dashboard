import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import SidebarItem from './SidebarItem'

function PoolSelector () {
  return (
    <div>
      <Flex column>
        <div>SELECT POOLS</div>
        <SidebarItem/>
        <SidebarItem/>
      </Flex>
    </div>
  )
}

export default PoolSelector