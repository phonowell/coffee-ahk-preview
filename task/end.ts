import $ from 'fire-keeper'
import { replacer } from '../toolkit'

// interface

type Target = 'browser' | 'electron'

// function

async function clean_(): Promise<void> {
  await $.remove_([
    './dist/css',
    './dist/favicon.ico',
    './dist/js',
  ])
}

// fix problem with `if(!await get(something))` for Safari 10/11
async function fix_(
  target: Target
): Promise<void> {

  if (target !== 'browser') return
  await replacer.replaceIfNotAwait_('./dist/static/js/**/*.js')
}

async function getPath_(
  target: Target
): Promise<string> {

  if (target === 'electron')
    return '.'

  if (target === 'browser') {
    type Config = {
      id: string
    }

    const { id }: Config = await $.read_('./config.json') as Config
    return `//activity.hdslb.com/blackboard/activity${id}`
  }

  throw new Error(`invalid target: ${target}`)
}

async function main_(): Promise<void> {

  const target: Target = $.argv()._[1] || 'browser'

  if (!await validate_()) throw new Error('task/end: 0')

  await move_()
  await clean_()
  await fix_(target)
  await removeSourcemap_()

  const path = await getPath_(target)
  await replaceIndex_(path)
  await replaceScript_(path)
  await replaceStyle_(path)
}

async function makeMeta_(): Promise<string> {

  type Config = {
    author: string
    name: string
  }

  const config = await $.read_('./config.json') as Config
  let { author } = config
  const { name } = config

  if (author === 'wangqiong01')
    author = 'Mimiko'

  return [
    '<meta charset="utf-8">',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">',
    '<meta name="renderer" content="webkit">',
    '<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,viewport-fit=cover">',
    `<meta name="author" content="${author}">`, // author
    '<link rel="icon" href="//www.bilibili.com/favicon.ico">', // favicon
    `<title>${name}</title>`, // title
    '<script>var __timestamp_on_load__ = new Date().getTime();</script>',
  ].join('')
}

function makeNote(): string {

  const message: string = [
    'Bilibili Manga Activity Project',
    '/',
    `${makeTime()} @ Mimiko`,
  ].join(' ')

  return `<!-- ${message} -->`
}

function makeTime(): string {
  const date: Date = new Date()
  return [
    date.getFullYear(),
    '/',
    date.getMonth() + 1,
    '/',
    date.getDate(),
    ' ',
    date.getHours(),
    ':',
    date.getMinutes().toString()
      .padStart(2, '0'),
    ':',
    date.getSeconds().toString()
      .padStart(2, '0'),
  ].join('')
}

async function move_(): Promise<void> {
  await $.copy_('./dist/css/**/*.css', './dist/static/css')
  await $.copy_('./dist/js/**/*.js', './dist/static/js')
}

async function removeSourcemap_(): Promise<void> {

  await Promise.all((await $.source_('./dist/**/*.js')).map(
    source => (async () => {

      const content: string = await $.read_(source) as string
      if (!content.includes('sourceMappingURL')) return

      const cont: string = content
        .split('\n')
        .map(line => (line.startsWith('//# sourceMappingURL=') ? '' : line))
        .join('\n')
      await $.write_(source, cont)
    })()
  ))
}

async function replaceIndex_(
  path: string
): Promise<void> {

  const _path = `${path}/static`
  const content: string = (await $.read_('./dist/index.html') as string)

    // remove
    .replace(/<noscript>[\s\S]*?<\/noscript>/u, '')

    // static
    .replace(/ href="/gu, ` href="${_path}`)
    .replace(/ src="/gu, ` src="${_path}`)

    // replace
    .replace(/lang="en"/gu, 'lang="zh-cmn-hans"')
    .replace(/<meta.*?<\/title>/u, await makeMeta_())

  await $.write_('./dist/index.html', [
    makeNote(),
    content,
  ].join('\n'))
}

async function replaceScript_(
  path: string
): Promise<void> {

  await Promise.all((await $.source_('./dist/static/**/*.js')).map(
    source => (async () => {

      const content: string = await $.read_(source) as string
      if (!(content.includes('"css/') || content.includes('"js/'))) return

      const cont: string = content
        .replace(/"css\//gu, `"${path}/static/css/`)
        .replace(/"js\//gu, `"${path}/static/js/`)

      await $.write_(source, cont)
    })()
  ))
}

async function replaceStyle_(
  path: string
): Promise<void> {

  await Promise.all((await $.source_('./dist/static/**/*.css')).map(
    source => (async () => {

      const content: string = await $.read_(source) as string
      if (!content.includes('url(..')) return

      const cont: string = content
        .replace(/url\(\.\./gu, `url(${path}`)

      await $.write_(source, cont)
    })()
  ))
}

async function validate_(): Promise<boolean> {
  const content: string = await $.read_('./dist/index.html') as string
  if (!content) return false
  return !content.startsWith('<!-- Bilibili Manga Activity Project')
}

// export
export default main_
