import $type from './type'

// variable

const $ = {
  type: $type,
}

// function

function main(
  input: unknown
): string {

  const type = $.type(input)

  if (type === 'array')
    return JSON.stringify({ __container__: input })
      .replace(/\{(.*)\}/u, '$1')
      .replace(/"__container__":/u, '')

  if (type === 'object')
    return JSON.stringify(input)

  if (type === 'string')
    return input as string

  return String(input)
}

// export
export default main
