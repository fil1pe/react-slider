import { ReactNode } from 'react'

export const prepend = (
  arr: Array<Exclude<ReactNode, boolean | null | undefined>>,
  length: number
) => {
  if (!arr.length) return []
  let i = arr.length - 1
  const arrToPrepend: typeof arr = []
  while (arrToPrepend.length < length) {
    arrToPrepend.unshift(arr[i])
    if (--i === -1) i = arr.length - 1
  }
  return arrToPrepend
}

const append = (
  arr: Array<Exclude<ReactNode, boolean | null | undefined>>,
  length: number
) => {
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
