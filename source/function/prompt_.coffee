# function

execute_ = (message, value) ->

  unless message
    throw 'empty message'

  unless $el = app.refs?.prompt
    throw 'element not found'

  await $el.set message, value # return

# export
export default (message, value) ->

  try
    await execute_ message, value
  catch e
    $.i "prompt_/error: #{e.message}"
    null