import $ from 'fire-keeper'

// function

function main(
  path: string
): {
  basename: string
  source: string
  target: string
} {

  const source: string = $.getDirname(path)
  const basename: string = $.getBasename(path)
  const target: string = [
    source.replace(/\/source/u, '/src'),
    '/',
    basename,
    '.vue',
  ].join('')

  return { basename, source, target }
}

// export
export default main
