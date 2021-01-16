# variable

cache = 0

# function

@atScroll = (e) ->

  {scrollTop, scrollHeight, offsetHeight} = @$refs.container

  if e.type == 'touchmove'
    if scrollTop <= 0 and e.targetTouches[0].clientY - cache >= 0
      if e.cancelable then e.preventDefault()
      @emitAt 'top'
    else if scrollTop + offsetHeight >= scrollHeight and e.targetTouches[0].clientY - cache <= 0
      if e.cancelable then e.preventDefault()
      @emitAt 'bottom'

  @render()

@atScrollStart = (e) -> cache = e.targetTouches[0].clientY

@emitAt = (position) ->

  {isMobile} = window.self.kuma.env

  if position == 'top'
    @$emit 'edge'
    @$emit 'edge-top'
  else if position == 'bottom'
    @$emit 'edge'
    @$emit 'edge-bottom'

@enter = -> @$nextTick => @render()

@render = _.throttle (e) ->

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

, 200, trailing: true

@scrollTop = (value) ->
  unless value?
    return @$refs.container.scrollTop
  @$refs.container.scrollTop = value

# export
export default
  data: ->
    style: {}

  props:
    theme:
      type: String
      default: 'default'