import compile_ from 'coffee-ahk'

import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/coffeescript/coffeescript'

# variable

cache =
  ahk: ''
  coffee: ''

# function

@enter = ->

  setInterval =>
    if @coffee == cache.coffee
      return
    cache.coffee = @coffee
    @transpile_()
  , 200

@transpile_ = ->
  compile_ @coffee,
    asText: true
  .then (result) =>
    @ahk = result
    cache.ahk = result
  .catch (e) =>
    @ahk = [
      cache.ahk
      "; #{e.message}"
    ].join '\n'

# export
export default

  data: ->
    ahk: ''
    coffee: ''
    option:
      mode: 'text/x-coffeescript'
      tabSize: 2
      theme: 'monokai'
      value: ''

  components:
    codemirror: codemirror