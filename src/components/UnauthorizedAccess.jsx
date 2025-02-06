import React from 'react'

const UnauthorizedAccess = () => {
  return (
    <div className='d-flex align-items-center justify-content-center bg-dark' style={{height:"100vh"}}>
      <h2 className='text-danger'>Unauthorized Access <a href='/login'>Click Here</a> to login</h2>
    </div>
  )
}

export default UnauthorizedAccess
