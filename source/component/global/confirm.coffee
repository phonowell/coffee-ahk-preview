# function

@close = -> @submit false

@format = (input) ->
  input
  .replace /\<br\>/g, '\n'
  .split '\n'

@submit = (value) ->
  @mask.resolve value
  $.mask false

# export
export default
  computed:
    mask: -> app.refs.mask
    # ---
    message: -> @format @mask.message
    no: -> @mask.no
    theme: -> @mask.theme
    title: -> @mask.title
    yes: -> @mask.yes