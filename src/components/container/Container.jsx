import React from 'react'

function Container({children}) {
  return (
    <div className='w-full max-w-7xl mx-auto px-4 border-t-2 border-t-gray'>
      {children}
    </div>
  )
}

export default Container
