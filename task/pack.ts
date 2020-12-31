import $ from 'fire-keeper'

// function

async function main_(): Promise<void> {

  await $.remove_('../electron-builder/dist/app')
  await $.copy_('./dist/**/*', '../electron-builder/dist/app')
}

// export
export default main_
