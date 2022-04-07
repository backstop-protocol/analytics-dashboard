import Flex from 'styled-flex-component';
import styled from 'styled-components'
import {IconWrapper} from './styleComponents'

const MutedTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;

  color: #8F98B7;
  padding-top: 24px;
  text-align: center;
`

const MutedLink = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  margin-left: 20px;
  color: #9FA8C7;
`

const FooterText = styled.div`
  font-style: italic;
  font-weight: 500;
  font-size: 10px;
  color: #9FA8C7;

  padding: 24px;
  text-align: center;
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
      style={{display: "inline-block", margin: "24px"}}>
      <Flex alignCenter>
        <IconWrapper>
          <img src={icon}/>
        </IconWrapper>
        <MutedLink>{text}</MutedLink>
      </Flex>
    </a>
  )
}

function Footer () {
  return (
    <footer style={{width: "100%"}}>
      <MutedTitle>Community</MutedTitle>
      <Flex alignCenter justifyCenter>
        <CommunityLink text="GitHub" url="https://github.com/backstop-protocol"/>
        <CommunityLink text="Twitter" url="https://twitter.com/bprotocoleth"/>
        <CommunityLink text="Medium" url="https://medium.com/b-protocol"/>
        <CommunityLink text="Discord" url="https://discord.com/invite/bJ4guuw"/>
      </Flex>
      
      <FooterText>© 2022 Smart Future Labs</FooterText>
    </footer>
  )
}

export default Footer