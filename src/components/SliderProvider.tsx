import React, { useEffect, useState } from 'react'
import { context } from './sliderContext'

export default function SliderProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [resizeIndicator, setResizeIndicator] = useState(0)

  useEffect(() => {
    let _resizeIndicator = resizeIndicator
    const onResize = () => {
      _resizeIndicator = (_resizeIndicator + 1) % 2
      setResizeIndicator(_resizeIndicator)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <context.Provider value={{ resizeIndicator }}>{children}</context.Provider>
  )
}
