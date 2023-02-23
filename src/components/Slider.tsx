import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import useTouch from './useTouch'
import append, { prepend } from './append'
import translateX from './translateX'
import Track from './Track'
import TrackWrapper from './TrackWrapper'
import Dots from './Dots'
import cn from 'classnames'

// arrow type enum
export enum ArrowType {
  Prev,
  Next,
}

// arrow html props
type ArrowProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

// component settings:
type SliderProps = {
  children: React.ReactNode
  slidesToShow?: number // number of slides per page
  slidesToScroll?: number // number of slides to scroll on click on prev/next
  slidesToAppend?: number // additional number of slides to append before and after
  finite?: boolean
  className?: string
  renderArrow?: (props: ArrowProps, type?: ArrowType) => React.ReactElement
  renderController?: (currentSlide: number) => React.ReactElement // additional controller
  autoplayTimeout?: number // autoplay interval in ms
  adaptiveHeight?: boolean
  pagination?: number // shows current slide index alongside the total number of slides
  onSlideChange?: (slide: number) => void
}

// exposed methods:
export type SliderRef = {
  slickGoTo: (slide: number) => void
  slickNext: () => void
  slickPrev: () => void
}

export default forwardRef<SliderRef, SliderProps>(function Slider(
  {
    children,
    slidesToShow = 1,
    slidesToScroll = slidesToShow,
    slidesToAppend = 0,
    finite,
    className,
    renderArrow: Arrow = (props, type) => (
      <button {...props}>
        {type === ArrowType.Next ? 'Next' : 'Previous'}
      </button>
    ),
    renderController,
    autoplayTimeout,
    adaptiveHeight,
    pagination = 0,
    onSlideChange,
  },
  thisRef
) {
  const [locked, setLocked] = useState(false) // mutex

  const slideCount = React.Children.count(children) // total number of slides
  const lastSlide = slideCount - slidesToScroll
  const [transition, setTransition] = useState<number>(0.5) // transition duration
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToSlide = (slide: number) => {
    if (locked || slideCount <= slidesToShow) return
    setLocked(true)
    if (slide >= slideCount) {
      if (finite) {
        setCurrentSlide(lastSlide)
        onSlideChange?.(lastSlide)
        return setTimeout(() => setLocked(false), 500)
      }
      setCurrentSlide(slideCount)
      onSlideChange?.(0)
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
        onSlideChange?.(0)
        return setTimeout(() => setLocked(false), 500)
      }
      setCurrentSlide(-slidesToScroll)
      onSlideChange?.(lastSlide)
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
      if (slide >= lastSlide) slide = lastSlide
      else if (slide % slidesToScroll)
        slide = slide - (slide % slidesToScroll) + slidesToScroll
      setCurrentSlide(slide)
      onSlideChange?.(slide)
      setTimeout(() => setLocked(false), 500) // release mutex
    }
  }

  // autoplay:
  useEffect(() => {
    if (autoplayTimeout) {
      const intervalId = setInterval(
        () => goToSlide(currentSlide + slidesToScroll),
        autoplayTimeout
      )
      return () => clearInterval(intervalId)
    }
  }, [autoplayTimeout, goToSlide])

  // sliding on touch:
  const { ref, x } = useTouch(
    currentSlide,
    slidesToScroll,
    goToSlide,
    setTransition
  )

  // clone some slides to make it infinite:
  const slides = (
    (!finite || slidesToAppend) && slideCount > slidesToShow
      ? prepend(React.Children.toArray(children), slidesToShow + slidesToAppend)
      : []
  )
    .concat(React.Children.toArray(children))
    .concat(
      (!finite || slidesToAppend) && slideCount > slidesToShow
        ? append(
            React.Children.toArray(children),
            slidesToShow + slidesToAppend
          )
        : []
    )

  // number of dots:
  const dotCount = Math.ceil(slideCount / slidesToScroll) // number of dots

  // adaptive height:
  const currentSlideRef = useRef<HTMLLIElement>(null)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (adaptiveHeight) setHeight(currentSlideRef.current?.offsetHeight || 0)
  }, [adaptiveHeight, currentSlide, children])

  // expose some methods:
  useImperativeHandle(thisRef, () => ({
    slickGoTo: goToSlide,
    slickNext: () => goToSlide(currentSlide - slidesToScroll),
    slickPrev: () => goToSlide(currentSlide + slidesToScroll),
  }))

  return (
    <div className={className} ref={ref}>
      <div className="main">
        {slideCount > slidesToShow &&
          Arrow(
            {
              onClick: () => goToSlide(currentSlide - slidesToScroll),
              className: cn(
                'arrow',
                finite && currentSlide === 0 && 'disabled'
              ),
            },
            ArrowType.Prev
          )}
        <TrackWrapper
          className="track"
          style={{
            height: Boolean(adaptiveHeight && height)
              ? `${height}px`
              : undefined,
          }}
        >
          <Track
            style={{
              transform: translateX(
                ref.current,
                (finite && !slidesToAppend) || slideCount <= slidesToShow
                  ? currentSlide
                  : currentSlide + slidesToShow + slidesToAppend,
                x,
                slidesToShow
              ),
              transitionDuration: Boolean(transition)
                ? `${transition}s`
                : undefined,
            }}
            center={slideCount <= slidesToShow}
            slidesPerPage={slidesToShow}
            adaptiveHeight={adaptiveHeight}
          >
            {React.Children.map(slides, (slide, key) => {
              const isCurrentSlide =
                key ===
                ((finite && !slidesToAppend) || slideCount <= slidesToShow
                  ? currentSlide
                  : currentSlide + slidesToShow + slidesToAppend)
              return (
                <li
                  key={key}
                  ref={isCurrentSlide ? currentSlideRef : undefined}
                  className={cn({ active: isCurrentSlide })}
                >
                  {slide}
                </li>
              )
            })}
          </Track>
        </TrackWrapper>
        {renderController?.(
          currentSlide >= slideCount
            ? 0
            : currentSlide < 0
            ? lastSlide
            : currentSlide
        )}
        {slideCount > slidesToShow &&
          Arrow(
            {
              onClick: () => goToSlide(currentSlide + slidesToScroll),
              className: cn(
                'arrow',
                finite && currentSlide === lastSlide && 'disabled'
              ),
            },
            ArrowType.Next
          )}
      </div>

      {slideCount > slidesToShow && (
        <Dots className="dots">
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
        </Dots>
      )}

      {Boolean(pagination) && (
        <span className="pages">
          {(currentSlide < 0
            ? lastSlide
            : currentSlide >= slideCount
            ? 0
            : currentSlide) + 1}
          {pagination > 1 ? ' / ' : '/'}
          {slideCount}
        </span>
      )}
    </div>
  )
})
