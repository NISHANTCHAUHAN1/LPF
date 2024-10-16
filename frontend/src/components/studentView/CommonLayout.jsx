import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const CommonLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default CommonLayout
