import React from 'react'

// list that wraps the slides:
const Track = ({
  center,
  slidesPerPage,
  adaptiveHeight,
  style,
  children,
}: {
  center: boolean
  slidesPerPage: number
  adaptiveHeight?: boolean
  style: React.CSSProperties
  children: React.ReactNode
}) => (
  <ul
    style={{
      ...({ '--slides-per-page': slidesPerPage } as React.CSSProperties),
      justifyContent: center ? 'center' : undefined,
      alignItems: adaptiveHeight ? 'flex-start' : undefined,
      ...style,
    }}
  >
    {children}
  </ul>
)

export default Track
