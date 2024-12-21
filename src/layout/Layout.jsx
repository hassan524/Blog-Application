import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header />

            <Outlet />

      <Sidebar />
    </>
  )
}

export default Layout