// src/components/Sidebar.jsx

import React from 'react';
import './Sidebar.css';

const Sidebar = ({
  onOverlayCheckboxChange,
  terrainChecked,
  trafficChecked,
  bicycleChecked,

}) => {
  return (
    
    <div className="left-sidebar">
      <ul className="sidebar-menu">
        <li>
          <a href="/dashboard">버스지도</a>
        </li>
        <li>
          <a href="/menu1">메뉴1</a>
        </li>
        <li>
          <a href="/menu2">메뉴2</a>
        </li>
        <li>
          <a href="/menu3">메뉴3</a>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              id="chkTerrain"
              checked={terrainChecked}
              onChange={() => onOverlayCheckboxChange('terrain')}
            />
            지형정보 보기
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              id="chkTraffic"
              checked={trafficChecked}
              onChange={() => onOverlayCheckboxChange('traffic')}
            />
            실시간 교통정보 보기
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              id="chkBicycle"
              checked={bicycleChecked}
              onChange={() => onOverlayCheckboxChange('bicycle')}
            />
            실시간 자전거도로 정보 보기
          </label>
        </li>
      </ul>
    </div>
  );
};




export default Sidebar;
