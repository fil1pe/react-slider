import { createContext } from 'react'

/**
 * The context object for the slider, providing a resize indicator.
 *
 * @type {React.Context<{ resizeIndicator: number }>}
 */
export const context = createContext({
  resizeIndicator: 0,
})
