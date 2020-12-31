// function

function main(
  cont: string,
  list: string[] | undefined
): string {

  if (!cont) return ''
  if (!list) return cont
  if (cont.includes('components:')) return cont

  const listImport: string[] = []
  const listComponent: string[] = []
  for (let i = 0; i < list.length; i++) {
    const source = list[i]
    const [name, path]: [string, string] = source.split(' ') as [string, string]

    const _name = `__component_${i}__`
    const _path = path.toLowerCase() === path
      ? `@/component/${path}.vue`
      : `@bilibili-firebird/activity.vue/${path}`

    if (name.startsWith('async-')) {
      listComponent.push(`'${name}': (() => import('${_path}'))`)
    } else {
      listImport.push(`import ${_name} from '${_path}'`)
      if (_path.startsWith('@bilibili-firebird/activity.vue/'))
        listImport.push(`import '${_path}.css'`)
      listComponent.push(`'${name}': ${_name}`)
    }
  }

  const _cont = [
    listImport.join('\n'),
    cont,
  ].join('\n')

  return [
    _cont,
    `  components: {${listComponent.join(', ')}}`,
  ].join('\n')
}

// export
export default main
