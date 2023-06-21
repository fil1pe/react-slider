// position the slider:
function translateX(
  ref: HTMLDivElement | null,
  slide: number,
  offset: number,
  slidesToShow: number,
  currentSlideRef: HTMLLIElement | null
) {
  if (!ref) return `translateX(${(slide * -100) / slidesToShow}%)`
  return `translateX(${
    -slide * (currentSlideRef?.getBoundingClientRect().width || 0) + offset
  }px)`
}

export default translateX
