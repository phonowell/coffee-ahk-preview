import $ from 'fire-keeper'

// function

async function main_(
  path: string,
  fn: (content: string) => string
): Promise<void> {

  const cont: string = fn(await $.read_(path) as string)
  await $.write_(path, cont)
}

// export
export default main_
