import $ from 'fire-keeper'
import _ from 'lodash'

// interface

type Option = {
  title: string
  value: string
}

// function

async function ask_(
  item: string
): Promise<string> {

  const list = [
    'cancel',
    'delete',
    'move',
    'rename',
  ]

  const answer = await $.prompt_({
    id: 'action-task/cpt',
    list,
    message: item,
    type: 'auto',
  })

  if (!answer) return ''

  if (!list.includes(answer)) return ask_(item)

  return answer
}

async function count_(): Promise<Option[]> {
  return (await $.source_('./source/component/**/*.pug'))
    .map(item => {
      const value = item
        .replace(/.*\/source\/component\//u, '')
        .replace('.pug', '')
      let title = value
      if (title.includes('/'))
        title = `${_.last(title.split('/'))}(${title})`
      return { title, value }
    })
}

async function delete_(
  item: string
): Promise<void> {

  const value = await $.prompt_({
    message: `sure to delete '${item}'?`,
    type: 'confirm',
  })

  if (value !== true) return

  await Promise.all(['.coffee', '.pug', '.styl'].map(
    extname => $.remove_(`./source/component/${item}${extname}`))
  )
}

async function main_(): Promise<void> {

  // shortcut
  if ($.argv()._[1] === 'new') return new_()

  const list = await count_()

  list.unshift(
    {
      title: '#exit',
      value: '#exit',
    },
    {
      title: '#new',
      value: '#new',
    }
  )

  const item = await pick_(list)

  if (!item) return undefined
  else if (item === '#exit') return undefined
  else if (item === '#new') await new_()
  else {

    const answer = await ask_(item)

    if (!answer) return undefined
    // if (answer === 'cancel') void 0
    if (answer === 'delete') await delete_(item)
    if (answer === 'move') await move_(item)
    if (answer === 'rename') await rename_(item)
  }

  return main_()
}

async function move_(
  item: string
): Promise<void> {

  const position = await $.prompt_({
    id: 'position-task/cpt',
    message: 'position',
    type: 'text',
  })
  if (!position) {
    $.i('empty position')
    return
  }

  await Promise.all(['.coffee', '.pug', '.styl'].map(
    extname => $.move_(
      `./source/component/${item}${extname}`,
      `./source/component/${position}`
    )
  ))
}

async function new_(): Promise<void> {

  const content = {
    '.coffee': [
      '# export',
      'export default {}',
    ].join('\n'),
    '.pug': "div(v-if = 'false')",
    '.styl': '',
  } as const

  const position = await $.prompt_({
    id: 'position-task/cpt',
    message: 'position',
    type: 'text',
  })
  if (!position) {
    $.i('empty position')
    return
  }

  const name = await $.prompt_({
    message: 'name',
    type: 'text',
  })
  if (!name) {
    $.i('empty name')
    return
  }

  await Promise.all(Object.keys(content).map(
    extname => (async () => {
      const cont: string = content[extname]
      const target = `./source/component/${position}/${name}${extname}`
      if (await $.isExisted_(target)) {
        $.i(`${target} already exists`)
        return
      }
      await $.write_(target, cont)
    })()
  ))
}

async function pick_(
  list: Option[]
): Promise<string> {

  const answer = await $.prompt_({
    list,
    message: 'select a component',
    type: 'auto',
  })

  if (!answer) return ''

  if (!_.find(list, { value: answer }))
    return pick_(list)

  return answer
}

async function rename_(
  item: string
): Promise<void> {

  const name = await $.prompt_({
    default: _.last(item.split('/')),
    message: 'name',
    type: 'text',
  })
  if (!name) {
    $.i('empty name')
    return
  }

  await Promise.all(['.coffee', '.pug', '.styl'].map(
    extname => $.rename_(
      `./source/component/${item}${extname}`,
      { basename: name }
    )
  ))
}

// export
export default main_
