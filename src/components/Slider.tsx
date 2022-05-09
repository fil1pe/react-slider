import React, { useState } from 'react'
import useTouch from './useTouch'
import Track from './Track'
import translateX from './translateX'
import cn from 'classnames'

// component settings:
type Props = {
  children: React.ReactNode
  slidesToShow?: number // number of slides per page
  slidesToScroll?: number // number of slides to scroll on click on prev/next
  finite?: boolean
  className: string
  renderArrow?: (
    props: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  ) => React.ReactElement
}

const Slider = ({
  children,
  slidesToShow = 1,
  slidesToScroll = slidesToShow,
  finite,
  className,
  renderArrow: Arrow = (props) => <button {...props}></button>,
}: Props) => {
  const [locked, setLocked] = useState(false) // mutex

  const slideCount = React.Children.count(children) // total number of slides
  const lastSlide = slideCount - slidesToScroll
  const [transition, setTransition] = useState<number>(0.5) // transition duration
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToSlide = (slide: number) => {
    if (locked) return
    setLocked(true)
    if (slide >= slideCount) {
      if (finite) {
        setCurrentSlide(lastSlide)
        return setTimeout(() => setLocked(false), 500)
      }
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
      if (finite) {
        setCurrentSlide(0)
        return setTimeout(() => setLocked(false), 500)
      }
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
      if (slide >= lastSlide) setCurrentSlide(lastSlide)
      else if (slide % slidesToScroll)
        setCurrentSlide(slide - (slide % slidesToScroll) + slidesToScroll)
      else setCurrentSlide(slide)
      setTimeout(() => setLocked(false), 500) // release mutex
    }
  }

  // sliding on touch:
  const { ref, x } = useTouch(currentSlide, goToSlide, setTransition)

  // clone some slides to make it infinite:
  const slides = React.Children.toArray(children)
    .filter((_, index) => index >= slideCount - slidesToShow)
    .concat(React.Children.toArray(children))
    .concat(
      React.Children.toArray(children).filter(
        (_, index) => index < slidesToShow
      )
    )

  // number of dots:
  const dotCount = Math.ceil(slideCount / slidesToScroll) // number of dots

  return (
    <div className={className} ref={ref}>
      <div className="main">
        <Arrow
          onClick={() => goToSlide(currentSlide - slidesToScroll)}
          className={cn('arrow', finite && currentSlide === 0 && 'disabled')}
        />
        <div className="track">
          <Track
            style={{
              transform: translateX(
                ref.current,
                currentSlide + slidesToShow,
                x,
                slidesToShow
              ),
              transitionDuration: Boolean(transition) && `${transition}s`,
            }}
          >
            {React.Children.map(slides, (slide, key) => (
              <li key={key}>{slide}</li>
            ))}
          </Track>
        </div>
        <Arrow
          onClick={() => goToSlide(currentSlide + slidesToScroll)}
          className={cn(
            'arrow',
            finite && currentSlide === lastSlide && 'disabled'
          )}
        />
      </div>

      <ul className="dots">
        {Array.from(Array(dotCount).keys()).map((_, key) => (
          <li
            key={key}
            className={cn({
              active:
                key * slidesToScroll === currentSlide ||
                (key === 0 && currentSlide >= slideCount) ||
                (key === dotCount - 1 && currentSlide === lastSlide) ||
                (key === dotCount - 1 && currentSlide < 0),
            })}
          >
            <button
              onClick={() =>
                goToSlide(
                  key === dotCount - 1 ? lastSlide : key * slidesToScroll
                )
              }
            >
              {key}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Slider
