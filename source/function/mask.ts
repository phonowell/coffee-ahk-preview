// interface

import { App } from '../type'
// eslint-disable-next-line init-declarations
declare const app: App

// interface

type Callback = (...args: unknown[]) => unknown

export type Option = {
  data?: unknown
  default?: unknown
  id?: string
  isVisible?: boolean
  message?: string
  no?: string
  resolve?: (result: boolean) => void
  theme?: string
  yes?: string
}

// function

function main(
  option: Option | boolean = true,
  callback?: Callback
): unknown {

  const $el = app.refs?.mask as {
    execute: Callback
  }

  if (!$el)
    throw new Error('element not found')

  return $el.execute(option, callback)
}

// export
export default main
