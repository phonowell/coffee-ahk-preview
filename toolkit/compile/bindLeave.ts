// function

function main(
  cont: string,
  path: string,
  type: string
): string {

  if (!path.includes('component')) return cont
  if (!cont) return ''

  if (type === 'mp') return signMp(cont)
  if (type === 'spa') return signSpa(cont)
  return sign(cont)
}

function sign(
  cont: string
): string {

  if (!cont.includes('@leave =')) return cont
  if (cont.includes('destroyed: ->')) return cont

  return [
    cont,
    '  destroyed: -> @leave()',
  ].join('\n')
}

function signMp(
  cont: string
): string {

  if (!cont.includes('@leave =')) return cont
  if (cont.includes('onHide:')) return cont

  return [
    cont,
    '  onHide: -> @leave()',
  ].join('\n')
}

function signSpa(
  cont: string
): string {

  if (!cont.includes('@leave =')) return cont
  if (cont.includes('beforeRouteLeave:')) return cont

  return [
    cont,
    '  beforeRouteLeave: (to, from, next) ->',
    '    await @leave to, from',
    '    @$refs.page.leave()',
    '    next()',
  ].join('\n')
}

// export
export default main
