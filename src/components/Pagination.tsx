import React, { useMemo } from 'react'

export default function Pagination({
  type,
  slideCount,
  slidesToScroll,
  currentSlide,
}: {
  type: number
  slideCount: number
  slidesToScroll: number
  currentSlide: number
}) {
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
