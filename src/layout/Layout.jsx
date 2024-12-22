import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React from 'react'
import Main from '@/pages/Main'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>

    
      <Header />

      <Outlet />

      <Sidebar />

      <Main />

    </>
  )
}

export default Layout