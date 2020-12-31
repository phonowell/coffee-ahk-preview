import { FnAsync, Type } from '../type'
import $ from 'fire-keeper'
import _ from 'lodash'
import bindEnter from './bindEnter'
import bindLeave from './bindLeave'
import bindMethod from './bindMethod'
import coffee from 'coffeescript'
import injectBasic from './injectBasic'
import injectComponent from './injectComponent'
import injectFn_ from './injectFn_'
import injectLodash from './injectLodash'
import makeVariable from './makeVariable'
import pug from 'pug'
import replaceAlias from './replaceAlias'
import replaceError from './replaceError'
import replaceExport from './replaceExport'
import signComponent from './signComponent'

// function

class M {

  pool: Map<string, FnAsync> = new Map()
  type: Type = 'activity'

  static async compilePug_(path: string): Promise<[string, string[]]> {

    let contPug: string = await $.read_(path) as string
    contPug = contPug ? contPug.trim() : ''

    const _listResult = signComponent(contPug)
    contPug = _listResult[0]
    const listComponent = _listResult[1]

    const contHtml: string = pug.compile(contPug)()
    return [contHtml, listComponent]
  }

  static async compileStyl_(path: string): Promise<[string, boolean]> {

    let contStyl: string = await $.read_(path) as string
    contStyl = contStyl ? contStyl.trim() : ''

    // contStyl = replaceNamespace(contStyl, path)
    contStyl = injectBasic(contStyl)

    const isScoped = !(contStyl.search(/\s*\/{2}\s*@scope/u))
    return [contStyl, isScoped]
  }

  async compileCoffee_(path: string, option: {
    component?: string[]
  } = {}): Promise<string> {

    let contCoffee: string = await $.read_(path) as string
    contCoffee = contCoffee ? contCoffee.trim() : ''

    contCoffee = replaceAlias(contCoffee)
    contCoffee = bindEnter(contCoffee, path, this.type)
    contCoffee = bindLeave(contCoffee, path, this.type)
    contCoffee = bindMethod(contCoffee, path)
    contCoffee = injectLodash(contCoffee)
    contCoffee = await injectFn_(contCoffee)
    contCoffee = injectComponent(contCoffee, option.component)
    contCoffee = replaceError(contCoffee)
    contCoffee = replaceExport(contCoffee)

    return coffee.compile(contCoffee) as string
  }

  async compile_(path: string): Promise<void> {

    // check type of path
    if (typeof path !== 'string')
      throw new Error(`compiler/error: invalid type of path: '${path}'`)

    // check path
    if (!await $.isExisted_(path))
      throw new Error(`compiler/error: invalid path: '${path}'`)

    const { basename, source, target }: {
      basename: string
      source: string
      target: string
    } = makeVariable(path)

    $.info().pause()

    // const contJson = await $.read_(`${source}/${basename}.yaml`) as IObject
    const [contHtml, listComponent]: [string, string[]] = await M.compilePug_(`${source}/${basename}.pug`)
    const [contStyl, isScoped]: [string, boolean] = await M.compileStyl_(`${source}/${basename}.styl`)
    const contJs: string = await this.compileCoffee_(`${source}/${basename}.coffee`, {
      component: listComponent,
    })

    let contResult: string[] = []

    if (contHtml)
      contResult = [
        ...contResult,
        '<template>',
        contHtml,
        '</template>',
      ]

    if (contStyl)
      contResult = [
        ...contResult,
        isScoped ? '<style lang="stylus" scoped>' : '<style lang="stylus">',
        contStyl,
        '</style>',
      ]

    if (contJs)
      contResult = [
        ...contResult,
        '<script>',
        contJs,
        '</script>',
      ]

    await $.write_(target, contResult.join('\n'))

    $.info().resume()
    $.info(`made '${target}'`)
  }

  async debounce_(key: string, fn_: FnAsync): Promise<unknown> {

    let fnAsync: FnAsync | undefined = this.pool.get(key)
    if (fnAsync)
      return fnAsync()

    fnAsync = _.debounce(async () => {
      await fn_()
      this.pool.delete(key)
    }, 5e3) as FnAsync
    this.pool.set(key, fnAsync)

    return fnAsync()
  }
}

// export
export default new M()
