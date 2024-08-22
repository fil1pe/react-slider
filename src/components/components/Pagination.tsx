import React, { useMemo } from 'react'

/**
 * A component that renders pagination information.
 *
 * @param {Object} props - The properties object.
 * @param {number} props.type - The type of pagination display.
 * @param {number} props.slideCount - The total number of slides.
 * @param {number} props.slidesToScroll - The number of slides to scroll per page.
 * @param {number} props.currentSlide - The index of the current slide.
 * @returns {JSX.Element} - The JSX element representing the pagination.
 */
const Pagination = ({
  type,
  slideCount,
  slidesToScroll,
  currentSlide,
}: {
  type: number
  slideCount: number
  slidesToScroll: number
  currentSlide: number
}) => {
  const pageCount = useMemo(
    () => Math.ceil(slideCount / slidesToScroll),
    [slideCount, slidesToScroll]
  )
  const currentPage = useMemo(
    () =>
      currentSlide < 0
        ? pageCount - 1
        : currentSlide >= slideCount
        ? 0
        : Math.ceil(currentSlide / slidesToScroll),
    [slideCount, slidesToScroll, pageCount, currentSlide]
  )

  return (
    <span className="pages">
      {currentPage + 1}
      {type > 1 ? ' / ' : '/'}
      {pageCount}
    </span>
  )
}

export default Pagination
