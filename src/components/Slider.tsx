import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import useTouch from './useTouch'
import append, { prepend } from './append'
import translateX from './translateX'
import Track from './Track'
import TrackWrapper from './TrackWrapper'
import Dots from './Dots'
import Pagination from './Pagination'
import cn from 'classnames'
import { context } from './sliderContext'

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
    children: _children,
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
  const children = useMemo(() => React.Children.toArray(_children), [_children])
  const [locked, setLocked] = useState(false) // mutex

  const slideCount = children.length // total number of slides
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
      ? prepend(children, slidesToShow + slidesToAppend)
      : []
  )
    .concat(children)
    .concat(
      (!finite || slidesToAppend) && slideCount > slidesToShow
        ? append(children, slidesToShow + slidesToAppend)
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

  // fix translation on window resize:
  const { resizeIndicator } = useContext(context)
  useEffect(() => {
    if (locked) return
    setTransition(0)
    setCurrentSlide(currentSlide)
    const timeout = setTimeout(() => setTransition(0.5), 500)
    return () => clearTimeout(timeout)
  }, [resizeIndicator])

  return (
    <div className={className}>
      <div className="main">
        {slideCount > slidesToShow &&
          Arrow(
            {
              onClick: () =>
                goToSlide(
                  currentSlide === lastSlide
                    ? Math.max(currentSlide - slidesToScroll, 0)
                    : currentSlide - slidesToScroll
                ),
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
          ref={ref}
        >
          <Track
            style={{
              transform: translateX(
                currentSlideRef.current,
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
        <Pagination
          type={pagination}
          slideCount={slideCount}
          slidesToScroll={slidesToScroll}
          currentSlide={currentSlide}
        />
      )}
    </div>
  )
})

export { default as SliderProvider } from './SliderProvider'
