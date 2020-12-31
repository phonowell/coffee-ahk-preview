// interface
import { Type } from '../type'

// function

function main(
  cont: string,
  path: string,
  type: Type
): string {

  if (!cont) return ''
  if (!path.includes('component')) return cont
  if (!path.includes('index.pug')) return cont

  let container = ''
  if (type === 'mp') {
    container = '.page'
  } else if (type === 'spa') {
    container = 'page#page'
    if (cont.includes(container)) return cont
  } else {
    throw new Error(`injectContainer/error: invalid type '${type}'`)
  }

  const listCont: string[] = cont
    .split('\n')
    .map(line => `  ${line}`)

  return [
    `${container}(ref = 'page')`,
    ...listCont,
  ].join('\n')
}

// export
export default main
