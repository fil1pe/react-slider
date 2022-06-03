import styled from 'styled-components'

// list with the dots:
const Dots = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  button {
    font-size: 0;
    padding: 0;
    display: block;
    width: 8px;
    height: 8px;
    margin: 0 4px;
    border-radius: 50%;
  }
`

export default Dots
