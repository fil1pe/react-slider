import React from 'react'

/**
 * A component that wraps the slides in a list.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.center - Whether to center the slides.
 * @param {number} props.slidesPerPage - The number of slides to display per page.
 * @param {boolean} [props.adaptiveHeight] - Whether to adapt the height based on the content.
 * @param {React.CSSProperties} props.style - The custom styles to apply to the list.
 * @param {React.ReactNode} props.children - The slides to be rendered inside the list.
 * @returns {JSX.Element} - The JSX element representing the track.
 */
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
