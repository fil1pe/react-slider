import React, { useEffect, useRef, useState } from 'react'

// handle sliding on touch:
const useTouch = (
  currentSlide: number,
  slidesToScroll: number,
  goToSlide: (slide: number) => void,
  setTransition: React.Dispatch<React.SetStateAction<number>> // set transition duration
) => {
  const [startX, setStartX] = useState(0) // initial touching position
  const [x, setX] = useState(0) // save touching position
  const ref = useRef<HTMLDivElement>(null) // wrapper element to drag

  useEffect(() => {
    const wrapper = ref.current
    // capture initial touching position:
    const onTouchStart = (e: TouchEvent) => {
      const { clientX: x } = e.touches[0]
      setStartX(x)
      setTransition(0) // avoid css transition
    }
    wrapper?.addEventListener('touchstart', onTouchStart)
    return () => wrapper?.removeEventListener('touchstart', onTouchStart)
  }, [])

  useEffect(() => {
    const wrapper = ref.current
    // change slider position based on touching position:
    const onTouchMove = (e: TouchEvent) => {
      const { clientX: x } = e.touches[0]
      setX(x - startX)
    }
    wrapper?.addEventListener('touchmove', onTouchMove)
    return () => wrapper?.removeEventListener('touchmove', onTouchMove)
  }, [startX])

  useEffect(() => {
    const wrapper = ref.current
    const onTouchEnd = () => {
      setTransition(0.5)
      const threshold = x / (wrapper?.offsetWidth || 1)
      // move on to the next/prev slide based on the threshold
      if (threshold <= -0.33) goToSlide(currentSlide + slidesToScroll)
      else if (threshold >= 0.33) goToSlide(currentSlide - slidesToScroll)
      setX(0)
    }
    wrapper?.addEventListener('touchend', onTouchEnd)
    return () => wrapper?.removeEventListener('touchend', onTouchEnd)
  }, [currentSlide, x])

  return { ref, x }
}

export default useTouch
