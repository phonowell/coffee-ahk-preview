import './Stage.css'
import Compiler from './Compiler'
import React from 'react'

// variable

// component
const Stage: React.FC = () => {

  // render
  return (
    <div className='stage'>

      <Compiler></Compiler>

    </div>
  )
}

// export
export default Stage