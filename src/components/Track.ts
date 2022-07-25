import styled, { css } from 'styled-components'

// list that wraps the slides:
const Track = styled.ul<{
  center?: boolean
  slidesPerPage: number
  adaptiveHeight?: boolean
}>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  ${(props) =>
    props.center &&
    css`
      justify-content: center;
    `}
  ${(props) => css`
    > li {
      flex: 0 0 ${100 / props.slidesPerPage}%;
    }
  `}
  ${(props) =>
    props.adaptiveHeight &&
    css`
      align-items: flex-start;
    `}
`

export default Track
