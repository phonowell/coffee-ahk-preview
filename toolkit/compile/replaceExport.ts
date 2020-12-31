// function

function main(
  cont: string
): string {

  if (!cont) return ''

  return cont
    .replace('module.exports =', 'export default')
    .replace('export default {}', 'export default')
}

// export
export default main
