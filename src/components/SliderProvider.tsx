import React, { useEffect, useState } from 'react'
import { context } from './sliderContext'

/**
 * A provider component that manages the slider context.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The children elements to be rendered inside the provider.
 * @returns {JSX.Element} - The JSX element representing the slider provider.
 */
const SliderProvider = ({ children }: { children: React.ReactNode }) => {
  const [resizeIndicator, setResizeIndicator] = useState(0)

  // Handle window resize and update the resize indicator state
  useEffect(() => {
    let _resizeIndicator = resizeIndicator
    const onResize = () => {
      _resizeIndicator = (_resizeIndicator + 1) % 2
      setResizeIndicator(_resizeIndicator)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <context.Provider value={{ resizeIndicator }}>{children}</context.Provider>
  )
}

export default SliderProvider
