import $ from 'fire-keeper'
import { Env } from '../type'
import replace_ from './replace_'

// interface

type Config = {
  [key: string]: string
}

// function

async function main_(
  target: Env
): Promise<void> {

  const data: Config = await $.read_('./data/config.yaml') as Config

  await $.compile_('./source/module/config.coffee', './src', {
    base: './source',
  })

  await replace_('./src/module/config.js', (cont: string) => {

    let _cont = cont

    for (const key of Object.keys(data)) {
      _cont = _cont
        .replace(`{{${key}}}`, data[key][target])
    }

    return _cont
      .replace(/"false"/gu, 'false')
      .replace(/"true"/gu, 'true')
  })
}

// export
export default main_
