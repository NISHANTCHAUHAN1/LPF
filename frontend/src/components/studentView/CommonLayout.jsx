import React from 'react'
import { Outlet } from 'react-router-dom'

const CommonLayout = () => {
  return (
    <div>
      CommonLayout CONTENT
      <Outlet />
    </div>
  )
}

export default CommonLayout
