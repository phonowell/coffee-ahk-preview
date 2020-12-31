// function

function main(
  cont: string
): string {

  if (!cont) return ''

  return cont
    // _.assign() -> Object.assign()
    .replace(/[_$]\.assign/gu, 'Object.assign')
}

// export
export default main
