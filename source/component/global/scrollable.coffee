# function

@emitAt = (position) ->

  {isMobile} = window.self.kuma.env

  @isFrozen = true
  $.delay (if isMobile then 100 else 300), => @isFrozen = false

  if position == 'top'
    @$emit 'edge'
    @$emit 'edge-top'
  else if position == 'bottom'
    @$emit 'edge'
    @$emit 'edge-bottom'

@enter = -> @$nextTick => @next()

@next = _.throttle ->

  {scrollTop, scrollHeight, offsetHeight} = @$refs.container

  height = offsetHeight / scrollHeight
  if height >= 1
    @style =
      display: 'none'
    return

  top = scrollTop / scrollHeight

  if top < 0
    height += top
    top = 0
  else if top > 1 - height
    height -= top - (1 - height)
    top = 1 - height

  transform = "translateY(#{top * offsetHeight}px) scaleY(#{height})"
  @style = {transform}

  if scrollTop <= 0 then @emitAt 'top'
  else if scrollTop + offsetHeight >= scrollHeight
    @emitAt 'bottom'

, 100, trailing: true

@scrollTop = (value) ->
  unless value?
    return @$refs.container.scrollTop
  @$refs.container.scrollTop = value

# export
export default
  data: ->
    isFrozen: false
    style: {}

  props:
    theme:
      type: String
      default: 'default'