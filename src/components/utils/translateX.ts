/**
 * Position the slider by translating it along the X-axis.
 *
 * @param {HTMLLIElement | null} currentSlideRef - The reference to the current slide element.
 * @param {number} slide - The index of the current slide.
 * @param {number} offset - The offset value to adjust the translation.
 * @param {number} slidesToShow - The number of slides to show at once.
 * @returns {string} - The CSS translateX value to position the slider.
 */
const translateX = (
  currentSlideRef: HTMLLIElement | null,
  slide: number,
  offset: number,
  slidesToShow: number
) => {
  if (!currentSlideRef) return `translateX(${(slide * -100) / slidesToShow}%)`
  return `translateX(${
    -slide * (currentSlideRef.getBoundingClientRect().width || 0) + offset
  }px)`
}

export default translateX
