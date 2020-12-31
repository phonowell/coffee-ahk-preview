// interface

import { App } from '../type'
// eslint-disable-next-line init-declarations
declare const app: App

// function

function main(
  isVisible = true
): boolean {

  const $el = app.refs?.wait as {
    isVisible: boolean
  }
  if (!$el) throw new Error('element not found')


  $el.isVisible = isVisible

  return isVisible
}

// export
export default main
