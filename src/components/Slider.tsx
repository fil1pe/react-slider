/* eslint-disable react-hooks/exhaustive-deps */
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
import append, { prepend } from './utils/append'
import translateX from './utils/translateX'
import Track from './components/Track'
import TrackWrapper from './components/TrackWrapper'
import Dots from './components/Dots'
import Pagination from './components/Pagination'
import cn from 'classnames'
import { context } from './sliderContext'

/**
 * Enum for arrow types.
 *
 * @readonly
 * @enum {string}
 */
export enum ArrowType {
  Prev,
  Next,
}

type ArrowProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

/**
 * Props for the Slider component.
 *
 * @typedef {Object} SliderProps
 * @property {number} [slidesToShow=1] - Number of slides per page.
 * @property {number} [slidesToScroll=slidesToShow] - Number of slides to scroll on click on prev/next.
 * @property {number} [slidesToAppend=0] - Additional number of slides to append before and after.
 * @property {number} [initialSlide=0] - Number of the first slide to show.
 * @property {boolean} [finite] - Whether the slider is finite.
 * @property {boolean} [slidableWithMouse=false] - Whether the slider can be slid with mouse events.
 * @property {string} [className] - Additional class for the slider.
 * @property {function} [renderArrow] - Function to render custom arrows.
 * @property {function} [renderController] - Function to render an additional controller.
 * @property {number} [autoplayTimeout] - Autoplay interval in milliseconds.
 * @property {boolean} [adaptiveHeight] - Whether the slider should adapt its height.
 * @property {number} [pagination=0] - Shows current slide index alongside the total number of slides.
 * @property {function} [onSlideChange] - Callback function when the slide changes.
 */
type SliderProps = {
  children: React.ReactNode
  slidesToShow?: number
  slidesToScroll?: number
  slidesToAppend?: number
  initialSlide?: number
  finite?: boolean
  slidableWithMouse?: boolean
  className?: string
  renderArrow?: (props: ArrowProps, type?: ArrowType) => React.ReactElement
  renderController?: (currentSlide: number) => React.ReactElement
  autoplayTimeout?: number
  adaptiveHeight?: boolean
  pagination?: number
  onSlideChange?: (slide: number) => void
}

/**
 * Exposed methods for the Slider component.
 *
 * @typedef {Object} SliderRef
 * @property {function(number): void} slickGoTo - Method to go to a specific slide.
 * @property {function(): void} slickNext - Method to go to the next slide.
 * @property {function(): void} slickPrev - Method to go to the previous slide.
 */
export type SliderRef = {
  slickGoTo: (slide: number) => void
  slickNext: () => void
  slickPrev: () => void
}

/**
 * Slider component.
 *
 * @param {SliderProps} props - The properties for the Slider component.
 * @param {React.Ref<SliderRef>} thisRef - The reference to the Slider component.
 * @returns {JSX.Element} - The rendered Slider component.
 */
const Slider = forwardRef<SliderRef, SliderProps>(function Slider(
  {
    children: _children,
    slidesToShow = 1,
    slidesToScroll = slidesToShow,
    slidesToAppend = 0,
    initialSlide = 0,
    finite,
    slidableWithMouse = false,
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

  // Mutex
  const [locked, setLocked] = useState(false)

  // Total number of slides
  const slideCount = children.length
  const lastSlide = slideCount - slidesToScroll

  // Transition duration
  const [transition, setTransition] = useState<number>(0.5)
  const [currentSlide, setCurrentSlide] = useState(initialSlide)

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

      // Magic for infinite slider
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

      // Magic for infinite slider
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

  // Autoplay
  useEffect(() => {
    if (autoplayTimeout) {
      const intervalId = setInterval(
        () => goToSlide(currentSlide + slidesToScroll),
        autoplayTimeout
      )
      return () => clearInterval(intervalId)
    }
  }, [autoplayTimeout, goToSlide])

  // Sliding on touch
  const { ref, x } = useTouch(
    currentSlide,
    lastSlide,
    slidesToScroll,
    goToSlide,
    setTransition,
    slidableWithMouse
  )

  // Clone some slides to make it infinite
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

  // Number of dots
  const dotCount = Math.ceil(slideCount / slidesToScroll)

  // Adaptive height
  const currentSlideRef = useRef<HTMLLIElement>(null)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (adaptiveHeight) setHeight(currentSlideRef.current?.offsetHeight || 0)
  }, [adaptiveHeight, currentSlide, children])

  // Expose some methods
  useImperativeHandle(thisRef, () => ({
    slickGoTo: goToSlide,
    slickNext: () => goToSlide(currentSlide - slidesToScroll),
    slickPrev: () => goToSlide(currentSlide + slidesToScroll),
  }))

  // Fix translation on window resize
  const { resizeIndicator } = useContext(context)
  useEffect(() => {
    if (locked) return
    setTransition(0)
    setCurrentSlide(currentSlide)
    const timeout = setTimeout(() => setTransition(0.5), 500)
    return () => clearTimeout(timeout)
  }, [resizeIndicator])

  // Go to the initial slide when it changes
  useEffect(() => {
    if (locked) return
    setTransition(0)
    setCurrentSlide(initialSlide)
    const timeout = setTimeout(() => setTransition(0.5), 500)
    return () => clearTimeout(timeout)
  }, [initialSlide])

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
        <Dots>
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

export default Slider
export { default as SliderProvider } from './SliderProvider'
