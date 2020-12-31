import $ from 'fire-keeper'

// function

function main(
  cont: string,
  path: string
): string {

  if (!cont) return ''
  if (!path.includes('component')) return cont
  if (!path.includes('index.')) return cont

  const basename: string = $.getBasename($.getDirname(path))

  return cont
    .replace(/(#[\w-]+)/gu, (string) => {
      if (!string.slice(1).replace(/[0123456789abcdef]/gu, '')) return string
      return `${string}-${basename}`
    })
}

// export
export default main
