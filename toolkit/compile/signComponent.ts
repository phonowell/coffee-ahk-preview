import _ from 'lodash'

// function

function main(
  cont: string
): [string, string[]] {

  if (!cont) return ['', []]
  if (!cont.includes("inject = '")) return [cont, []]

  let listComponent: string[] = []
  const _cont = cont
    .replace(/([\w\-#.]*)\(([^()]*?)inject = '(.*?)'/gu, (
      _text, name: string, prefix: string, path: string
    ) => {

      const _name: string = name
        .replace(/#/gu, ' ')
        .replace(/\./gu, ' ')
        .split(' ')[0]
      listComponent.push(`${_name} ${path}`)
      return `${name}(${prefix}`
    })
  listComponent = _.uniq(listComponent)

  return [_cont, listComponent]
}

// export
export default main
