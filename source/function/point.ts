// interface

import { App } from '../type'
// eslint-disable-next-line init-declarations
declare const app: App

// function

function main(
  x: number,
  y: number
): void {

  const $el = app.refs?.point as {
    // eslint-disable-next-line no-shadow
    set: (x: number, y: number) => void
  }

  $el.set(x, y)
}

// export
export default main
