import $i from './i'
import $parseString from './parseString'

// interface

import { App } from '../type'
// eslint-disable-next-line init-declarations
declare const app: App

type Callback = (...args: unknown[]) => unknown

// variable

const $ = {
  i: $i,
  parseString: $parseString,
}

// function

function main<T>(
  message: T
): T {

  if (message === undefined || message === null) {
    return message
  }

  const msg = $.parseString(message).trim()
  if (!msg) {
    return message
  }

  if (msg.startsWith('#')) {
    $.i(msg)
    return message
  }

  const $el = app.refs?.info as {
    show: Callback
  }
  if (!$el) {
    throw new Error('element not found')
  }

  $el.show(msg)

  return message
}

// export
export default main
