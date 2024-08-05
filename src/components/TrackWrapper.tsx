import React, { forwardRef } from 'react'

// div that wraps the track:
const TrackWrapper = forwardRef<
  HTMLDivElement,
  { style: React.CSSProperties; children: React.ReactNode }
>(({ style, children }, ref) => (
  <div className="react-slider-track" style={style} ref={ref}>
    {children}
  </div>
))

export default TrackWrapper
