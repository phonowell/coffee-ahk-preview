# function

@close = -> $.mask false

@format = (input) ->
  input
  .replace /\<br\>/g, '\n'
  .split '\n'

# export
export default
  computed:
    mask: -> app.refs.mask
    # ---
    message: -> @format @mask.message
    theme: -> @mask.theme
    yes: -> @mask.yes