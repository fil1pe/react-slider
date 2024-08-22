/**
 * Prepend elements from the array to reach the specified length.
 * If the array is shorter than the specified length, it will repeat elements from the end.
 *
 * @template T
 * @param {Array<T>} arr - The array of elements to prepend.
 * @param {number} length - The desired length of the resulting array.
 * @returns {Array<T>} - The array with prepended elements.
 */
export const prepend = <T>(arr: Array<T>, length: number) => {
  if (!arr.length) return []
  let i = arr.length - 1
  const arrToPrepend: typeof arr = []
  while (arrToPrepend.length < length) {
    arrToPrepend.unshift(arr[i])
    if (--i === -1) i = arr.length - 1
  }
  return arrToPrepend
}

/**
 * Append elements from the array to reach the specified length.
 * If the array is shorter than the specified length, it will repeat elements from the beginning.
 *
 * @template T
 * @param {Array<T>} arr - The array of elements to append.
 * @param {number} length - The desired length of the resulting array.
 * @returns {Array<T>} - The array with appended elements.
 */
const append = <T>(arr: Array<T>, length: number) => {
  if (!arr.length) return []
  let i = 0
  const arrToAppend: typeof arr = []
  while (arrToAppend.length < length) {
    arrToAppend.push(arr[i])
    if (++i === arr.length) i = 0
  }
  return arrToAppend
}

export default append
