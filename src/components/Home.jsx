import React from 'react'
import MainLayout from './MainLayout'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Home = () => {
  return (
    <div className="home-container">
        <Navbar/>
        <MainLayout/>
    </div>
  )
}

export default Home