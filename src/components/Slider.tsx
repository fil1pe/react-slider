import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import cn from 'classnames'

const Track = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
`

// position the slider:
function translateX(ref: HTMLDivElement, slide: number, offset: number) {
  if (!ref) return `translateX(${slide * -100}%)`
  return `translateX(${
    -slide * ref.querySelector('li').offsetWidth + offset
  }px)`
}

// component settings:
type Props = {
  children: React.ReactNode
  className: string
}

const Slider = ({ children, className }: Props) => {
  const [locked, setLocked] = useState(false) // mutex

  const slidesToScroll = 1 // number of slides to scroll on click on prev/next
  const slideCount = React.Children.count(children) // total number of slides
  const lastSlide = slideCount - slidesToScroll
  const [transition, setTransition] = useState<number>(0.5) // transition duration
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToSlide = (slide: number) => {
    if (locked) return
    setLocked(true)
    if (slide >= slideCount) {
      setCurrentSlide(slideCount)
      // magic for infinite slider:
      setTimeout(() => {
        setTransition(0)
        setCurrentSlide(0)
        setTimeout(() => {
          setTransition(0.5)
          setLocked(false)
        }, 50)
      }, 500)
    } else if (slide < 0) {
      setCurrentSlide(-slidesToScroll)
      // magic for infinite slider:
      setTimeout(() => {
        setTransition(0)
        setCurrentSlide(lastSlide)
        setTimeout(() => {
          setTransition(0.5)
          setLocked(false)
        }, 50)
      }, 500)
    } else {
      if (slide > lastSlide && slide < lastSlide + slidesToScroll)
        setCurrentSlide(lastSlide)
      else if (slide % slidesToScroll)
        setCurrentSlide(slide - (slide % slidesToScroll) + slidesToScroll)
      else setCurrentSlide(slide)
      setTimeout(() => setLocked(false), 500) // release mutex
    }
  }

  // sliding on touch:
  const [startX, setStartX] = useState(0)
  const [x, setX] = useState(0)
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    const wrapper = ref.current
    // capture initial touching position:
    const onTouchStart = (e) => {
      const { clientX: x } = e.touches[0]
      setStartX(x)
      setTransition(0) // avoid css transition
    }
    wrapper.addEventListener('touchstart', onTouchStart)
    return () => wrapper?.removeEventListener('touchstart', onTouchStart)
  }, [])

  useEffect(() => {
    const wrapper = ref.current
    // change slider position based on touching position:
    const onTouchMove = (e) => {
      const { clientX: x } = e.touches[0]
      setX(x - startX)
    }
    wrapper.addEventListener('touchmove', onTouchMove)
    return () => wrapper?.removeEventListener('touchmove', onTouchMove)
  }, [startX])

  useEffect(() => {
    const wrapper = ref.current
    const onTouchEnd = () => {
      setTransition(0.5)
      const threshold = x / wrapper.offsetWidth
      // move on to the next/prev slide based on the threshold
      if (threshold <= -0.33) goToSlide(currentSlide + 1)
      else if (threshold >= 0.33) goToSlide(currentSlide - 1)
      setX(0)
    }
    wrapper.addEventListener('touchend', onTouchEnd)
    return () => wrapper?.removeEventListener('touchend', onTouchEnd)
  }, [currentSlide, x])

  // clone somes slides to make it infinite:
  const slides = React.Children.toArray(children)
    .filter((_, index) => index >= slideCount - slidesToScroll)
    .concat(React.Children.toArray(children))
    .concat(
      React.Children.toArray(children).filter(
        (_, index) => index < slidesToScroll
      )
    )

  return (
    <div className={className} ref={ref}>
      <div className="slider-and-controls">
        <button
          onClick={() => goToSlide(currentSlide - slidesToScroll)}
          className="arrow"
        ></button>
        <Track
          className="track"
          style={{
            transform: translateX(
              ref.current,
              currentSlide + slidesToScroll,
              x
            ),
            transitionDuration: Boolean(transition) && `${transition}s`,
          }}
        >
          {React.Children.map(slides, (slide, key) => (
            <li key={key}>{slide}</li>
          ))}
        </Track>
        <button
          onClick={() => goToSlide(currentSlide + slidesToScroll)}
          className="arrow"
        ></button>
      </div>

      <ul className="dots">
        {Array.from(Array(slideCount).keys()).map((_, key) => (
          <li
            key={key}
            className={cn({
              active:
                key === currentSlide ||
                (key === 0 && currentSlide >= slideCount) ||
                (key === slideCount - slidesToScroll && currentSlide < 0),
            })}
          >
            <button onClick={() => goToSlide(key)}>{key}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Slider
