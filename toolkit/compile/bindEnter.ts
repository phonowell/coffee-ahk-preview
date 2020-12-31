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

  if (!cont.includes('@enter =')) return cont
  if (cont.includes('mounted: ->')) return cont

  return [
    cont,
    '  mounted: -> @enter()',
  ].join('\n')
}

function signMp(
  cont: string
): string {

  if (!cont.includes('@enter =')) return cont
  if (cont.includes('onShow: ->')) return cont

  return [
    cont,
    '  onShow: -> @enter()',
  ].join('\n')
}

function signSpa(
  cont: string
): string {

  if (!cont.includes('@enter =')) return cont
  if (cont.includes('beforeRouteEnter:')) return cont

  return [
    cont,
    '  beforeRouteEnter: (to, from, next) ->',
    '    next (vm) ->',
    '      vm.$refs.page.enter()',
    '      vm.enter? to, from',
  ].join('\n')
}

// export
export default main
