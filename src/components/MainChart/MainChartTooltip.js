import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import { observer } from "mobx-react"

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

const TooltipTemplate = styled.div`
  padding: 20px;
  background: rgba(33, 91, 143, 0.04);
  backdrop-filter: blur(13px);
  border-radius: 12px;
`

const Circle = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({color})=> color};
  margin-right: 5px;
`
 
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  const date = new Date(label * 1000)
  const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return (
    <TooltipTemplate className="custom-tooltip">
      <CustomTooltipTitle>{dateString}</CustomTooltipTitle>
      {payload.map((item, i)=>{
        return (
          <Flex column key={i}>
            <CustomTooltipSubTitle>
              <Circle color={item.color}/>
              {item.dataKey}
            </CustomTooltipSubTitle>
            <CustomTooltipValue>
              {item.value}
            </CustomTooltipValue>
          </Flex>
        )
      })}
    </TooltipTemplate>
  );
}

export default observer(CustomTooltip)