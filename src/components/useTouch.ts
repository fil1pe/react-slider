import React, { useEffect, useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

// handle sliding on touch:
const useTouch = (
  currentSlide: number,
  lastSlide: number,
  slidesToScroll: number,
  goToSlide: (slide: number) => void,
  setTransition: React.Dispatch<React.SetStateAction<number>>, // set transition duration
  slidableWithMouse: boolean
) => {
  const [startPosition, setStartPosition] = useState<Position>({ x: -1, y: -1 }) // initial touching position
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 }) // save touching position
  const ref = useRef<HTMLDivElement>(null) // wrapper element to drag

  useEffect(() => {
    const wrapper = ref.current
    // capture initial touching position:
    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') return
      setStartPosition({ x: e.pageX, y: e.pageY })
      setTransition(0)
    }
    slidableWithMouse && wrapper?.addEventListener('mousedown', onMouseDown)
    const onTouchStart = (e: TouchEvent) => {
      wrapper?.removeEventListener('mousedown', onMouseDown)
      if ((e.target as HTMLElement).tagName === 'BUTTON') return
      const { clientX: x, clientY: y } = e.touches[0]
      setStartPosition({ x, y })
      setTransition(0) // avoid css transition
    }
    wrapper?.addEventListener('touchstart', onTouchStart)
    return () => {
      wrapper?.removeEventListener('touchstart', onTouchStart)
      wrapper?.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  useEffect(() => {
    const wrapper = ref.current
    if (startPosition.x >= 0) {
      // change slider position based on touching position:
      const onTouchMove = (e: TouchEvent) => {
        e.stopPropagation()
        const { clientX, clientY } = e.touches[0]
        const x = clientX - startPosition.x
        const y = clientY - startPosition.y
        if (Math.abs(x) > Math.abs(y)) {
          e.preventDefault()
          setPosition({ x, y })
        } else setStartPosition({ x: -1, y: -1 })
      }
      const onMouseMove = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setPosition({
          x: e.pageX - startPosition.x,
          y: e.pageY - startPosition.y,
        })
      }
      wrapper?.addEventListener('touchmove', onTouchMove)
      slidableWithMouse && wrapper?.addEventListener('mousemove', onMouseMove)
      return () => {
        wrapper?.removeEventListener('touchmove', onTouchMove)
        wrapper?.removeEventListener('mousemove', onMouseMove)
      }
    }
  }, [startPosition])

  useEffect(() => {
    const wrapper = ref.current
    const onTouchEnd = () => {
      setTransition(0.5)
      const threshold = position.x / (wrapper?.offsetWidth || 1)
      // move on to the next/prev slide based on the threshold
      if (threshold <= -0.33) goToSlide(currentSlide + slidesToScroll)
      else if (threshold >= 0.33)
        goToSlide(
          currentSlide === lastSlide
            ? Math.max(currentSlide - slidesToScroll, 0)
            : currentSlide - slidesToScroll
        )
      setPosition({ x: 0, y: 0 })
      setStartPosition({ x: -1, y: -1 })
    }
    const onMouseUp = onTouchEnd
    wrapper?.addEventListener('touchend', onTouchEnd)
    slidableWithMouse && wrapper?.addEventListener('mouseup', onMouseUp)
    return () => {
      wrapper?.removeEventListener('touchend', onTouchEnd)
      wrapper?.removeEventListener('mouseup', onMouseUp)
    }
  }, [currentSlide, position])

  return { ref, x: position.x }
}

export default useTouch
