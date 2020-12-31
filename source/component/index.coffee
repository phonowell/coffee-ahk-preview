import compile_ from 'coffee-ahk'

# function

@transpile_ = ->
  try
    @ahk = await compile_ @coffee,
      asText: true
  catch e
    @ahk = e.message

# export
export default
  data: ->
    ahk: ''
    coffee: ''