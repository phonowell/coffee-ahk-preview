import _ from 'lodash'

// function

function main(
  cont: string
): string {

  if (!cont) return ''
  if (!~cont.search(/_\.\w/u)) return cont

  let listReplace: string[] = []
  const _cont = cont
    .replace(/_\.(\w+?)[\s(]/gu, (text, name: string) => {
      listReplace.push(name)
      return text
    })

  let prefix = '_ = {}'
  listReplace = _.uniq(listReplace)
  for (const name of listReplace) {
    const nameCapital = `_fn${_.capitalize(name)}`

    prefix = [
      prefix,
      `import ${nameCapital} from 'lodash/${name}'`,
      `_.${name} = ${nameCapital}`,
    ].join('\n')
  }

  return [
    prefix,
    _cont,
  ].join('\n')
}

// export
export default main
