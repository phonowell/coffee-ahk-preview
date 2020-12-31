# function

@close = -> @submit null

@format = (data, valueDefault) ->

  list = data.map (it) ->
    unless ($.type it) == 'object'
      return
        key: it
        value: it
    it # return

  for it in list
    if it.value == valueDefault
      it.isMarked = true
      break

  list # return

@submit = (value) ->
  @mask.resolve value
  $.mask false

# export
export default

  computed:

    mask: -> app.refs.mask
    # ---
    list: -> @format @mask.data, @mask.default

    style: ->

      height = Math.min.apply @, [
        @mask.data.length * 48
        window.innerHeight - 64 - 50
      ]

      # return
      height: "#{height}px"