# variable

interval = if /Android|iPad|iPhone|iPod/.test navigator.userAgent
  100
else 20

# function

@click = ->
  if @isLocked then return
  @$emit 'click'

@cancel = ->
  @ts = 0
  @direction = ''

@end = (e) ->

  unless @validate e
    @cancel()
    return
  
  unless @ts
    @cancel()
    return

  unless @direction
    @cancel()
    return
  
  # unless @direction == 'x' then return

  distance = (e.pageX or e.changedTouches[0].pageX) - @startX
  if distance <= -80
    @$emit 'swipe-left'
    @$emit 'swipe-end', distance
    @lockClick e
    return
  if distance >= 80
    @$emit 'swipe-right'
    @$emit 'swipe-end', distance
    @lockClick e
    return

  distance = (e.pageY or e.changedTouches[0].pageY) - @startY
  if (Math.abs distance) > 80
    @lockClick e
    return

  @cancel()

@lockClick = (e) ->
  
  if e.type.includes 'touch'
    @cancel()
    return
  
  if @timer then clearTimeout @timer
  
  @isLocked = true
  @timer = $.delay 200, =>
    @isLocked = false
    @cancel()

@move = _.throttle (e) ->

  unless @validate e then return
  unless @ts then return

  unless @direction
    @setDirecton e
    return

  unless @direction == 'x' then return
  
  e.preventDefault()

  distance = (e.pageX or e.touches[0].pageX) - @startX
  @$emit 'swipe-move', distance

, interval, trailing: true

@setDirecton = (e) ->

  distance = (e.pageX or e.touches[0].pageX) - @startX
  if (Math.abs distance) > 16
    @direction = 'x'
    return

  distance = (e.pageY or e.touches[0].pageY) - @startY
  if (Math.abs distance) > 16
    @direction = 'y'
    return

@start = (e) ->
  
  @cancel()
  unless @validate e then return

  @ts = _.now()
  @startX = e.pageX or e.touches[0].pageX
  @startY = e.pageY or e.touches[0].pageY
  @direction = ''

  @$emit 'swipe-start'

@validate = (e) ->

  # disabled multi-touch
  if e.type.includes 'touch'

    if e.touches?.length > 1
      @$el.dispatchEvent $.event 'touchcancel'
      return

    if e.changedTouches?.length > 1
      @$el.dispatchEvent $.event 'touchcancel'
      return

  true # return

# export
export default
  data: ->
    direction: ''
    startX: 0
    startY: 0
    timer: undefined
    ts: 0