import Web3 from 'web3'

const {fromWei, toBN} = Web3.utils


export const DisplayBn = ({bn}) => {
  let [int, float] = fromWei(bn).split('.')
  float = float ? '.' + float.slice(0, 2) : ''
  const num = int + float
  return <span>{num}</span>
}

export const displayBn = (bn) => {
  let [int, float] = fromWei(bn).split('.')
  float = float ? '.' + float.slice(0, 2) : ''
  const num = int + float
  return num
}