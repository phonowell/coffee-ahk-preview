import { compiler, replacer } from '../toolkit'
import $ from 'fire-keeper'

// function

async function main_(): Promise<void> {

  // catch error
  process.on('uncaughtException', (e) => $.i(e.stack))

  // build
  await $.exec_('npm run alice build dev')

  // copy
  $.watch([
    './source/static/**/*',
    './source/include/**/*',
    './source/**/*.ts',
    // '!./source/**/*.ts'
  ], async (e: { path: string }) => {
    const target: string = $.getDirname(e.path)
      .replace('source', 'src')
    await $.copy_(e.path, target)
  })

  // compile

  $.watch([
    './source/function/**/*.coffee',
    './source/main.coffee',
    './source/module/**/*.coffee',
    // ---
    '!./source/module/config.coffee',
  ], (e: { path: string }) => {
    compiler.debounce_(e.path, async () => {
      const contJs: string = await compiler.compileCoffee_(e.path)
      const target: string = e.path
        .replace('/source', '/src')
        .replace('.coffee', '.js')
      await $.write_(target, contJs)
    })
  })

  $.watch([
    './source/index.*',
    './source/component/**/*',
  ], (e: { path: string }) => {
    const { basename, dirname }: {
      basename: string
      dirname: string
    } = $.getName(e.path)
    compiler.debounce_(`${dirname}/${basename}`, async () =>
      compiler.compile_(e.path)
    )
  })

  // config
  $.watch([
    './data/config.yaml',
    './source/module/config.coffee',
  ], () => {
    compiler.debounce_('replace/config', async () =>
      replacer.replaceConfig_('dev')
    )
  })
}

// export
export default main_
