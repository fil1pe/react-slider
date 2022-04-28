import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

function translateX(ref: HTMLDivElement, slide: number, offset: number) {
  if (!ref) return `translateX(${slide * -100}%)`
  return `translateX(${
    -slide * ref.querySelector('li').offsetWidth + offset
  }px)`
}

type Props = {
  children: React.ReactNode
  className: string
}

const Slider = ({ children, className }: Props) => {
  const [locked, setLocked] = useState(false)

  const slidesToScroll = 1
  const slideCount = React.Children.count(children)
  const lastSlide = slideCount - slidesToScroll
  const [transition, setTransition] = useState<number>(0.5)
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToSlide = (slide: number) => {
    if (locked) return
    setLocked(true)
    if (slide >= slideCount) {
      setCurrentSlide(slideCount)
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
      setTimeout(() => {
        setTransition(0)
        setCurrentSlide(lastSlide)
        setTimeout(() => {
          setTransition(0.5)
          setLocked(false)
        }, 50)
      }, 500)
    } else {
      if (slide - lastSlide > 0 && slide - lastSlide < slidesToScroll)
        setCurrentSlide(lastSlide)
      else if (slide % slidesToScroll) {
        const nextSlide = slide - (slide % slidesToScroll) + slidesToScroll
        setCurrentSlide(nextSlide)
      } else setCurrentSlide(slide)
      setTimeout(() => setLocked(false), 500)
    }
  }

  // Carrossel deslizante:
  const [startX, setStartX] = useState(0)
  const [x, setX] = useState(0)
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    const wrapper = ref.current
    const onTouchStart = (e) => {
      const { clientX: x } = e.touches[0]
      setStartX(x)
    }
    wrapper.addEventListener('touchstart', onTouchStart)
    return () => wrapper?.removeEventListener('touchstart', onTouchStart)
  }, [])

  useEffect(() => {
    const wrapper = ref.current
    const onTouchMove = (e) => {
      const { clientX: x } = e.touches[0]
      setTransition(0)
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
      if (threshold <= -0.33) goToSlide(currentSlide + 1)
      else if (threshold >= 0.33) goToSlide(currentSlide - 1)
      setX(0)
    }
    wrapper.addEventListener('touchend', onTouchEnd)
    return () => wrapper?.removeEventListener('touchend', onTouchEnd)
  }, [currentSlide, x])
  // Fim carrossel deslizante.

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
      <div>
        <button
          onClick={() => goToSlide(currentSlide - 1)}
          className="arrow"
        ></button>
        <ul
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
        </ul>
        <button
          onClick={() => goToSlide(currentSlide + 1)}
          className="arrow"
        ></button>
      </div>

      <ul className="dots">
        {Array(slideCount)
          .fill(0)
          .map((_, key) => (
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
