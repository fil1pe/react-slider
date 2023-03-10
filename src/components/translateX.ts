// position the slider:
function translateX(
  ref: HTMLDivElement | null,
  slide: number,
  offset: number,
  slidesToShow: number
) {
  if (!ref) return `translateX(${(slide * -100) / slidesToShow}%)`
  return `translateX(${
    -slide *
      (ref.querySelector('.track > ul > .active')?.getBoundingClientRect()
        .width || 0) +
    offset
  }px)`
}

export default translateX
