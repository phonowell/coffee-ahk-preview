// function

function main(time: number, fn: (...args: unknown[]) => unknown): NodeJS.Timeout {
  return setTimeout(fn as (...args: unknown[]) => unknown, time)
}

// export
export default main
