// src/components/LogoNavbar.jsx

import React from 'react'
import './LogoNavbar.css'  


const LogoNavbar = () => {
  return (
    <div className='logoNavbar'>
      <img src="/busLogo.png" alt="buslogo" className="logo-image" />
        <a href="/" className="logo">
             스마트버스
        </a>
    </div>
  )
}

export default LogoNavbar