import React from 'react'

function Logo({
  width = '100px',
  text = ""
}
) {
  return (
    <div>
      <h1 className={`${text}`}>Pulse</h1>
    </div>
  )
}

export default Logo
