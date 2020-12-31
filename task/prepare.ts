import $ from 'fire-keeper'

// function

async function compile_(): Promise<void> {

  await $.compile_([
    './data/kokoro/babel.config.ts',
    './data/kokoro/postcss.config.ts',
    './data/kokoro/vue.config.ts',
  ])
  await $.copy_('./data/kokoro/*.js', './')

  await $.compile_([
    './data/mock/*.yaml',
  ])

  await $.compile_([
    './data/*.yaml',
    '!./data/config.yaml',
  ])
}

async function countApi_(): Promise<string[]> {

  return (
    $.parseString((await $.read_('./task/mock.ts')) || '')
      .match(/bind\(router, '\w+?'/gu) || []
  ).map(text => text.split("'")[1])
}

async function countCpt_(): Promise<string[]> {

  return (await $.source_('./source/component/part/**/*.pug'))
    .map(source => source
      .split('/source/component/part/')[1]
      .split('.pug')[0]
    )
}

async function countFn_(): Promise<string[]> {

  const listFilename: string[] = (await $.source_([
    './source/function/**/*.coffee',
    './source/function/**/*.ts',
  ])).map(source => $.getFilename(source))
  const listSync: string[] = (await $.read_('./data/sync/function.yaml') as string[])
    .map(source => $.getFilename(source).split('@')[0])
  const listResult: string[] = []

  for (const filename of listFilename) {
    if (listSync.includes(filename)) continue
    listResult.push(filename)
  }

  return listResult
}

async function gitAdd_(): Promise<void> {

  const list = [
    '*.js',
    '*.json',
    '.gitignore',
    '.npmignore',
    'task/*.json',
  ]

  await $.exec_(list.map(it => `git add -f ./${it}`))
}

async function main_(): Promise<void> {

  await compile_()
  await gitAdd_()
  await replacePackage_()
  await replaceReadme_()
}

async function replacePackage_(): Promise<void> {

  type Data = {
    name: string
  }

  const source = './package.json'
  const content: Data = await $.read_(source) as Data
  content.name = $.getBasename($.getDirname($.normalizePath(source)))
  await $.write_(source, content)
}

async function replaceReadme_(): Promise<void> {

  type Data = {
    name: string
    pageName: string
  }

  type Url = {
    prd: string
    pre: string
    qrcode: string
    test: string
  }

  const { name, pageName }: Data = await $.read_('./config.json') as Data

  const source = './README.md'
  let content: string = await $.read_(source) as string

  const url: Url = {
    prd: `https://www.bilibili.com/blackboard/${pageName}`,
    pre: `https://www.bilibili.com/blackboard/preview/${pageName}`,
    qrcode: 'https://cli.im/api/qrcode/code?text=',
    test: 'https://www.bilibili.com/blackboard/preview/activity-D6lN6HmZ.html',
  }
  const contNav: string[] = [
    '## 导航',
    '',
    `- 预览环境 - [页面](${url.pre}) / [二维码](${url.qrcode}${encodeURIComponent(url.pre)})`,
    `- 生产环境 - [页面](${url.prd}) / [二维码](${url.qrcode}${encodeURIComponent(url.prd)})`,
    `- [功能测试](${url.test})`,
    '',
  ]

  const contFn: string[] = [
    '## 函数',
    '',
    ...(await countFn_()).map(filename => `- [${filename}](./source/function/${filename})`),
    '',
  ]

  const contCpt: string[] = [
    '## 组件',
    '',
    ...(await countCpt_()).map(_name => `- ${_name}, ${['.pug', '.styl', '.coffee']
      .map(extname => `[${extname}](./source/component/part/${_name}${extname})`)
      .join(' / ')
      }`),
    '',
  ]

  const contApi: string[] = [
    '## 接口',
    '',
    ...(await countApi_()).map(_name => `- [${_name}](./task/mock.ts)`),
    '',
  ]

  const cont: string = [
    `# ${name}`,
    '',
    ...contNav,
    ...contFn,
    ...contCpt,
    ...contApi,
    '---',
  ].join('\n')

  if (content.includes('---'))
    content = content
      .replace(/[\s\S]*?---/u, cont)
  else
    content = cont

  await $.write_('./README.md', content)
}

// export
export default main_
