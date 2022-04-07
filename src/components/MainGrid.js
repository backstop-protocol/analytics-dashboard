import Flex, { FlexItem } from 'styled-flex-component';
import styled from 'styled-components'
import PoolSelector from './PoolSelector';
import MainChart from './MainChart/MainChart';

const Grid = styled.div`
  padding: 20px 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 32px;
  grid-row-gap: 32px;


  .div1 { grid-area: 1 / 1 / 2 / 3; }
  .div2 { grid-area: 1 / 3 / 2 / 7; }
  /* .div3 { grid-area: 2 / 1 / 3 / 4; }
  .div4 { grid-area: 2 / 4 / 3 / 7; } */
  article { 
    margin: 0;
  }
`

function MainGrid () {
  return (
    <Grid>
      <div className="div1">
        <article>
          <PoolSelector/>
        </article>
      </div>
      <div className="div2">
        <MainChart />
      </div>
    </Grid>
  )
}

export default MainGrid