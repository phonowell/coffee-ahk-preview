# variable

modeFirst = ''

# function

@back = ->

  if modeFirst == 'list'
    @mode = 'list'
    return

  @hide()

@enter = ->

  unless kuma.user.isLogin
    $.login()
    @hide()
    return

  unless data = await @sync_()
    return

  @isReady = true
  @mode = app.refs.mask.data.mode or 'address'
  modeFirst = @mode

@hide = -> $.mask false

@sync_ = ->

  url = '/twirp/activity.v1.Activity/GetPrizeList'
  # url = 'http://localhost:8080/GetPrizeList'
  unless data = await $.post_ url, act_id: @id
    return

  @addr =
    detail: data.addr.address
    name: data.addr.name
    tel: data.addr.phone

  @list = data.prizes.map (it) =>
    id: it.user_prize_id
    type: it.prize_id
    name: @Prize[it.prize_id]?.name
    time: (new Date it.ctime).toLocaleString()
    isReal: @Prize[it.prize_id]?.isReal

  isReal = false
  for it in @list when it.isReal
    isReal = it.id
    break
  @isReal = isReal

  true # return

@submit_ = ->

  unless @validate()
    return

  url = '/twirp/activity.v1.Activity/EditPrizeAddress'

  data = await $.post_ url,
    user_prize_id: @isReal
    name: @addr.name
    phone: @addr.tel
    address: @addr.detail
  unless data
    return

  $.info '保存成功'
  @back()

@validate = ->

  unless 1 <= @addr.name.length <= 8
    $.info '姓名长度应在1至8个字符之间'
    return

  unless @addr.tel.length == 11
    $.info '手机号码长度应为11位'
    return
  if ~@addr.tel.search /\D/
    $.info '手机号码应全部为数字'
    return

  unless 5 <= @addr.detail.length <= 50
    $.info '详细地址长度应在5至50个字符之间'
    return

  true # return

# export
export default

  computed:
    id: -> app.refs.mask.data.id
    Prize: -> app.refs.mask.data.map or {}

  data: ->
    addr:
      address: ''
      name: ''
      tel: ''
    isReady: false
    isReal: false
    list: []
    mode: ''