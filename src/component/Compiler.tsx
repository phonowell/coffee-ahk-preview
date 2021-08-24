import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/coffeescript/coffeescript'
import './Compiler.css'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import React from 'react'
import c2a from 'coffee-ahk'

// component

const Compiler: React.FC = () => {

  const $iptAhk = React.useRef<HTMLTextAreaElement>(null)

  const [coffee, setCoffee] = React.useState('')
  const [ahk, setAhk] = React.useState('')

  // binding

  React.useEffect(() => {
    if (!$iptAhk.current) return
    $iptAhk.current.value = ahk
  }, [ahk])

  React.useEffect(() => {
    c2a(coffee, { asText: true })
      .then(cont => setAhk(cont))
      .catch(e => setAhk(`; ${e.message}`))
  }, [coffee])

  // render
  return (
    <div className='area-compiler'>

      <CodeMirror
        className='ipt-coffee'
        onChange={(_editor, _data, value) => setCoffee(value)}
        options={{
          lineWrapping: true,
          mode: 'text/x-coffeescript',
          tabSize: 2,
          theme: 'monokai',
          value: '',
        }}
      ></CodeMirror>
      <div className='flag flag-coffee'>.coffee</div>

      <textarea
        className='ipt-ahk'
        readOnly
        ref={$iptAhk}
      ></textarea>
      <div className='flag flag-ahk'>.ahk</div>

    </div>
  )
}

// export
export default Compiler