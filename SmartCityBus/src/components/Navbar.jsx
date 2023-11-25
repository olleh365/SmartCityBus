// src/components/Navbar.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LogoNavbar from './LogoNavbar';
import './Navbar.css';
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'


function Navbar() {

  const {currentUser} = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="container">
      <LogoNavbar/>
        <ul className="nav-menu">
          {/* <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li> */}
          <li><a href="/ChatHome">Services</a></li>
          {currentUser ? (
            <li><a onClick={() => signOut(auth)}>Logout</a></li>
          ) : (
            <li><a href="/Login">Login</a></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
