import { compiler, replacer } from '../toolkit'
import $ from 'fire-keeper'

// interface

import { Env } from '../toolkit/type'

// function

class M {

  listTarget: Env[] = [
    'dev', 'development',
    'pre', 'preview',
    'prd', 'production',
  ]

  static async compile_(): Promise<void> {

    const listSource: string[] = await $.source_([
      './source/function/**/*.coffee',
      './source/main.coffee',
      './source/module/**/*.coffee',
      // ---
      '!./source/module/config.coffee',
      '!./source/module/route.coffee',
    ])

    await Promise.all(listSource.map(
      source => (async () => {
        const contJs: string = await compiler.compileCoffee_(source)
        const target: string = source
          .replace('/source', '/src')
          .replace('.coffee', '.js')
        await $.write_(target, contJs)
      })()
    ))
  }

  static async copy_(): Promise<void> {

    const listSource: string[] = await $.source_([
      './source/include/**/*',
      './source/static/**/*',
      './source/**/*.ts',
      // '!./source/**/*.ts'
    ])

    await Promise.all(listSource.map(
      source => (async () => {

        const target: string = $.getDirname(source)
          .replace('source', 'src')
        await $.copy_(source, target)
      })()
    ))
  }

  static async prepare_(): Promise<void> {

    try {
      await $.task('prepare')()
    } catch (err) {
      await $.exec_('npm run alice prepare')
    }
    await $.remove_('./src')
  }

  static async replace_(
    target: Env
  ): Promise<void> {

    await replacer.replaceConfig_(target)

    const listSource: string[] = await $.source_([
      './source/index.pug',
      './source/component/**/*.pug',
    ])
    await Promise.all(listSource.map(source => compiler.compile_(source)))
  }

  async getTarget_(): Promise<Env> {

    const target: Env = $.argv().target
      || $.argv()._[1]
      || await $.prompt_({
        id: 'target-build',
        list: this.listTarget,
        type: 'auto',
      }) as Env

    if (!this.listTarget.includes(target))
      throw new Error(`invalid target '${target}'`)

    return {
      'dev': 'development',
      'prd': 'production',
      'pre': 'preview',
    }[target as 'dev' | 'pre' | 'prd'] as Env || target
  }

  async main_(): Promise<void> {

    const target: Env = await this.getTarget_()
    await M.prepare_()
    await M.copy_()
    await M.compile_()
    await M.replace_(target)
  }
}

// export
export default async (): Promise<void> => (new M()).main_()
