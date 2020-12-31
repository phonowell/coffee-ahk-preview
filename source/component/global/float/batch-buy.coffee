# function

@enter = ->

  unless kuma.user.isLogin
    $.login()
    @hide()
    return

  unless data = await @sync_()
    @hide()
    return

  _.assign @, data
  @isReady = true

@hide = -> $.mask false

@recharge = ->
  @hide()
  $.goto 'recharge'

@submit_ = ->

  unless @coin >= @current.cost[0]
    $.info '漫币余额不足，请前往充值中心先充值哦~'
    return

  unless @current.rest > 0
    $.info '您选取的章节无需购买，可直接阅读'
    return

  data = await $.post_ '/twirp/comic.v1.Comic/BuyEpisode',
    comic_id: @id
    buy_method: 3
    pay_amount: @current.cost[0]
    with_ord_scope: true
    start_ord: @order
    limit: @current.limit
  unless data
    return

  @hide()
  $.info '批量购买成功'

@sync_ = ->

  # id
  id = app.refs.mask.data

  # manga detail
  unless data = await $.post_ '/twirp/comic.v1.Comic/ComicDetail', comic_id: id
    return
  ep = _.find data.ep_list, ord: data.read_order
  ep or= data.ep_list[data.ep_list.length - 1]

  # title
  title = data.read_short_title

  # order
  order = ep.ord

  # buy info
  unless data = await $.post_ '/twirp/comic.v1.Comic/GetEpisodeBuyInfo', ep_id: ep.id
    return

  # list
  list = []
  cacheRest = -1
  for item in data.batch_buy

    unless item.usable
      continue

    unless item.amount != cacheRest
      continue
    cacheRest = item.amount

    list.push
      cost: [item.pay_gold, item.original_gold]
      discount: item.discount
      limit: item.batch_limit
      rest: item.amount

  # user detail
  unless data = await $.post_ '/twirp/user.v1.User/GetWallet'
    return

  # coin
  coin = data.remain_gold

  # return
  {id, coin, list, order, title}

# export
export default

  computed:
    current: -> @list[@selected]

  data: ->
    coin: 0
    id: 0
    list: []
    order: 0
    title: ''
    # ---
    selected: 0
    isReady: false