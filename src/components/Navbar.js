
// src/components/Navbar.js

import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <a href="/" className="logo">스마트버스</a>
        <ul className="nav-menu">
          {/* <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li> */}
          <li><a href="/services">Services</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
