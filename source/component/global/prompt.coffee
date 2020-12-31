# function

@close = -> @submit ''

@submit = (value = '') ->
  @$emit 'submit', value
  
  # sleep for better animation performance
  unless ($.data 'platform') == 'ios'
    await $.sleep_ 200
  
  $.mask false
  @isVisible = false

@set = (message, value) ->

  new Promise (resolve) =>

    @$off 'submit'
    @$on 'submit', (value) -> resolve value

    @message = message
    @value = value
    $.mask true, => @close()
    @isVisible = true

    @$nextTick => @$refs.ipt.select()

# export
export default
  data: ->
    isVisible: false
    message: ''
    value: ''