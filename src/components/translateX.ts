// position the slider:
function translateX(
  currentSlideRef: HTMLLIElement | null,
  slide: number,
  offset: number,
  slidesToShow: number
) {
  if (!currentSlideRef) return `translateX(${(slide * -100) / slidesToShow}%)`
  return `translateX(${
    -slide * (currentSlideRef.getBoundingClientRect().width || 0) + offset
  }px)`
}

export default translateX
