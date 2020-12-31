// fix problem with `if(!await get(something))` for Safari 10/11

import $ from 'fire-keeper'
import replace_ from './replace_'

// function

async function main_(
  source: string | string[]
): Promise<void> {

  await Promise.all((await $.source_(source)).map(
    // will fix
    // if ($.getExtname('src') !== '.js') continue
    src => replace_(src, content => replace(content))
  ))
}

function replace(
  input: string
): string {

  const output = input

    // from `!await xxx` to `!(await xxx)`
    .replace(/!await\s.*/gu, text => {

      const list = text.split(')')

      let countLeft = 0
      let countRight = 0

      for (const it of list) {
        countLeft += (it.match(/\(/gu) || []).length
        countRight += 1
        if (countLeft === countRight) break
      }

      return [
        `!(${list
          .slice(0, countRight)
          .join(')')
          .slice(1)
        })`,
        ...list.slice(countRight),
      ].join(')')
    })

    // from `void await xxx` to `void (await xxx)`
    .replace(/void\sawait\s[^;]+/gu, text => `void (${text.slice(5)})`)

  return output.includes('!await') || output.includes('void await')
    ? replace(output)
    : output
}

// export
export default main_
