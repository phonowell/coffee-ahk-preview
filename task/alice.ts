import $ from 'fire-keeper'
// interface

type FnAsync = (...args: unknown[]) => Promise<unknown>

// function

async function ask_(
  list: string[]
): Promise<string> {

  const answer = await $.prompt_({
    id: 'default-task',
    list,
    message: 'select a task',
    type: 'auto',
  })
  if (!answer) return ''
  if (!list.includes(answer)) return ask_(list)
  return answer
}

async function load_(): Promise<string[]> {

  const listSource = await $.source_('./task/*.ts')
  const listResult: string[] = []
  for (const source of listSource) {
    const basename = $.getBasename(source)
    if (basename === 'alice') continue
    listResult.push(basename)
  }
  return listResult
}

async function main_(): Promise<void> {

  let task = $.argv()._[0]
    ? $.argv()._[0].toString()
    : ''

  const list = await load_()

  if (!task) {
    task = await ask_(list)
    if (!task) return
  }

  await run_(task)
}

async function run_(
  task: string
): Promise<void> {

  const [source] = await $.source_(`./task/${task}.ts`)
  const fn_: FnAsync = (await import(source)).default
  await fn_()
}

// execute
main_()