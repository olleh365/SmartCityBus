// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="left-sidebar">
      <ul className="sidebar-menu">
        <li><a href="/dashboard">버스지도</a></li>
        <li><a href="/menu1">메뉴1</a></li>
        <li><a href="/menu2">메뉴2</a></li>
        <li><a href="/menu3">메뉴3</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;