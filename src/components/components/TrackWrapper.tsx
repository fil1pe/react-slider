import React, { forwardRef } from 'react'

/**
 * A div that wraps the track.
 *
 * @param {Object} props - The properties object.
 * @param {React.CSSProperties} props.style - The custom styles to apply to the div.
 * @param {React.ReactNode} props.children - The elements to be rendered inside the div.
 * @param {React.Ref<HTMLDivElement>} ref - The reference to the div element.
 * @returns {JSX.Element} - The JSX element representing the track wrapper.
 */
const TrackWrapper = forwardRef<
  HTMLDivElement,
  { style: React.CSSProperties; children: React.ReactNode }
>(({ style, children }, ref) => (
  <div className="react-slider-track track" style={style} ref={ref}>
    {children}
  </div>
))

export default TrackWrapper
