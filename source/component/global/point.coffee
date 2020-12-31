# function

@set = (x, y) ->

  if @isVisible
    return

  transform = "translate(#{x}px, #{y}px)"
  @style = {transform}

  @isVisible = true

  clearTimeout @timer
  @timer = $.delay 300, => @isVisible = false

# export
export default
  data: ->
    isVisible: false
    style: {}
    timer: null