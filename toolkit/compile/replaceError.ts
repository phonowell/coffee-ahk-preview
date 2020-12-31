// function

function main(
  cont: string
): string {

  if (!cont) return ''

  const listBoolean: boolean[] = [
    cont.includes('throw'),
    cont.includes('reject'),
  ]
  if (!listBoolean.includes(true)) return cont

  const listCont: string[] = cont
    .split('\n')
  for (let i = 0; i < listCont.length; i++) {
    const line: string = listCont[i]
    if (line.trim()[0] === '#') continue

    const _listBoolean: boolean[] = [
      line.includes('throw '),
      line.includes('reject '),
      line.endsWith('throw'),
      line.endsWith('reject'),
    ]
    if (!_listBoolean.includes(true)) continue

    listCont[i] = line
      .replace(/throw\s/gu, 'throw new Error ')
      .replace(/reject\s/gu, 'reject new Error ')
      .replace(/new Error new Error/gu, 'new Error')
  }

  return listCont.join('\n')
}

// export
export default main
