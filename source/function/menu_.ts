import { default as $mask, Option } from './mask'

// variable

const $ = {
  mask: $mask,
}

// function

function optionX(): Option {
  return {
    data: [],
    default: undefined,
    id: 'menu',
    isVisible: true,
    no: '取消',
    theme: 'default',
  }
}

async function main_(
  data: unknown[] | {
    key: string | number
    value: unknown
  }[],
  value?: unknown
): Promise<boolean> {

  const option: Option = {
    ...optionX(),
    data,
    default: value,
  }

  return await new Promise(resolve => {
    option.resolve = resolve
    $.mask(option)
  }) as boolean
}

// export
export default main_
