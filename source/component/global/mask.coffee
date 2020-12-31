# function

Data = ->
  callback: undefined
  default: undefined
  data: undefined
  id: ''
  isVisible: false
  no: '取消'
  resolve: undefined
  theme: 'default'
  yes: '确定'

@click = (e) ->
  unless e.target == app.refs.mask.$el
    return
  @callback?()

@execute = (option, callback) ->
  if ($.type option) == 'boolean'
    option =
      isVisible: option
  _.assign @, Data(), option, {callback}
  @promise # return

# export
export default

  data: Data

  watch:
    isVisible: (value) -> $.blockScroll value