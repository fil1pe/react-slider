import React from 'react'

/**
 * A component that renders a list of dots.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The children elements to be rendered inside the dots list.
 * @returns {JSX.Element} - The JSX element representing the dots list.
 */
const Dots = ({ children }: { children: React.ReactNode }) => (
  <ul className="react-slider-dots dots">{children}</ul>
)

export default Dots
