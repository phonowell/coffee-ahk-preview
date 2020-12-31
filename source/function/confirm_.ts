import { default as $mask, Option } from './mask'

// variable

const $ = {
  mask: $mask,
}

// function

function optionX(): Option & { title: string } {
  return {
    id: 'confirm',
    isVisible: true,
    message: '',
    no: '取消',
    theme: 'default',
    title: '',
    yes: '确定',
  }
}

async function main_(
  data: Option | string
): Promise<boolean> {

  const _data = typeof data === 'string'
    ? { message: data }
    : { ...data }

  const option = { ...optionX(), ..._data }

  return await new Promise(resolve => {
    option.resolve = resolve
    $.mask(option)
  }) as boolean
}

// export
export default main_
