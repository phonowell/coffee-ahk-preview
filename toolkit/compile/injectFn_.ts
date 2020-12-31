import $ from 'fire-keeper'
import _ from 'lodash'

// function

async function decideTarget_(
  name: string
): Promise<string> {

  if (await $.isExisted_(`./source/function/${name}.cover.ts`))
    return `@/function/${name}.cover.ts`

  if (await $.isExisted_(`./source/function/${name}.cover.coffee`))
    return `@/function/${name}.cover`

  if (await $.isExisted_(`./source/function/${name}.ts`))
    return `@/function/${name}.ts`

  if (await $.isExisted_(`./source/function/${name}.coffee`))
    return `@/function/${name}`

  return `@bilibili-firebird/kuma/${_.trim(name, '_')}`
}

async function main_(
  cont: string
): Promise<string> {

  if (!cont) return ''
  if (!~cont.search(/\$\.\w/u)) return cont

  const listReplace: string[] = []
  const _cont = cont
    .replace(/\$\.(\w+?)[\s(]/gu, (text, name: string) => {
      listReplace.push(name)
      return text
    })

  let prefix = '$ = {}';
  (await Promise.all(_.uniq(listReplace).map(
    name => (async () => [
      name,
      `__fn_${name}__`,
      await decideTarget_(name),
    ])()
  ))).forEach(([name, fnName, target]) => {
    prefix = [
      prefix,
      `import ${fnName} from '${target}'`,
      `$.${name} = ${fnName}`,
    ].join('\n')
  })

  return [
    prefix,
    _cont,
  ].join('\n')
}

// export
export default main_
