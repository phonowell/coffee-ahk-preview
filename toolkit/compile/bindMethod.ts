// function

function main(
  cont: string,
  path: string
): string {

  if (!path.includes('component')) return cont
  if (!cont) return ''

  if (cont.includes('methods:')) return cont
  if (!~cont.search(/\w+ = .*->/u)) return cont

  const listCont: string[] = cont
    .split('\n')

  const listResult: string[] = []

  for (let i = 0; i < listCont.length; i++) {
    const line: string = listCont[i]
    if (!line.trim()) continue // like ''
    if (!line[0].trim()) continue // like '  fn = ->'
    if (['#', '$', '_'].includes(line[0])) continue
    if (line[0] !== '@') continue // like 'fn = ->'

    const result: RegExpMatchArray | null = line.match(/@\w+ = .*->/gu)
    if (!result) continue

    const [name, ...subfix]: string[] = line.split('=')
    const _name = `__fn_this_${name.trim().slice(1)}__`

    listResult.push(`${name.trim().slice(1)}: ${_name}`)
    listCont[i] = [
      _name,
      ' = ',
      subfix.join('='),
    ].join('')
  }

  return [
    listCont.join('\n'),
    `  methods: {${listResult.join(', ')}}`,
  ].join('\n')
}

// export
export default main
