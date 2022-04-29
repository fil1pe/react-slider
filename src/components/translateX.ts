// position the slider:
function translateX(ref: HTMLDivElement | null, slide: number, offset: number) {
  if (!ref) return `translateX(${slide * -100}%)`
  return `translateX(${
    -slide * (ref.querySelector('li')?.offsetWidth || 0) + offset
  }px)`
}

export default translateX
