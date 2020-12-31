// function

function main(
  cont: string
): string {

  if (!cont) return ''

  return [
    "@import '~@/include/basic'",
    cont,
  ].join('\n')
}

// export
export default main
