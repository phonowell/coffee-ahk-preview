import $ from 'fire-keeper'

// function

const main = async (): Promise<void> => {

  await $.compile('./data/extended.yaml')
}

// export
export default main