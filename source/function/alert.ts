import { default as $mask, Option } from './mask'

// variable

const $ = {
  mask: $mask,
}

// function

function optionX() {
  return {
    id: 'alert',
    isVisible: true,
    message: '',
    theme: 'default',
    yes: '确定',
  }
}

function main(
  data: Option | string
): string {

  const _data = typeof data === 'string'
    ? { message: data }
    : { ...data }

  const option = { ...optionX(), ..._data }

  $.mask(option, () => $.mask(false))
  return option.message
}

// export
export default main
