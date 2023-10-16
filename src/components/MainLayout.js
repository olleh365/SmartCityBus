// src/components/MainLayout.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MainLayout.css';

function MainLayout() {
  const [busData, setBusData] = useState([]);

  useEffect(() => {
    const nodeId = 'GYB360052353'; // Replace with the actual bus stop node ID
    const cityCode = '37100'; // Replace with the actual city code
    const serviceKey = 'la4wqCP3h6b5GvQEY%2FR4dmPdN3UoBNyExtQyMukGGalOuEnHZumKTnC%2BaGoxeipsKJbn6uAttgmE%2BOYvAB7l5A%3D%3D';

    async function fetchBusArrivalInfo(nodeId, cityCode, serviceKey) {
      try {
        const apiUrl = 'http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList';
        const params = {
          serviceKey: decodeURIComponent(serviceKey), // Decode the service key
          _type: 'json',
          nodeId: nodeId,
          cityCode: cityCode,
        };

        const response = await axios.get(apiUrl, { params });

        console.log('API Response:', response.data); // Add this line to log the API response

        if (response.status === 200) {
          const data = response.data;
          if (data.response.body && data.response.body.items) {
            const items = data.response.body.items.item;

            if (Array.isArray(items)) {
              setBusData(items); // Set the bus data in state
            }
          }
        } else {
          console.error('Error fetching bus arrival information');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchBusArrivalInfo(nodeId, cityCode, serviceKey);

    // Initialize Kakao Map after the script is loaded
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');

      if (container) {
        const options = {
          center: new window.kakao.maps.LatLng(35.9012, 128.8485),
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);
        const busStops = [
          {
            nodeId: 'GYB360021000',
            cityCode: 37100,
            latitude: 35.8992,
            longitude: 128.8426,
            nodeName: '대구대서문',
          },
          {
            nodeId: 'GYB360019000',
            cityCode: 37100,
            latitude: 35.9012,
            longitude: 128.826,
            nodeName: '대구대삼거리(대구대방향)',
          },
          {
            nodeId: 'GYB360021100',
            cityCode: 37100,
            latitude: 35.8971,
            longitude: 128.8498,
            nodeName: '대구대(정문1)',
          },
          {
            nodeId: 'GYB360008400',
            cityCode: 37100,
            latitude: 35.9011,
            longitude: 128.8335,
            nodeName: '상림리',
          },
          {
            nodeId: 'GYB360052353',
            cityCode: 37100,
            latitude: 35.90043207,
            longitude: 128.837831,
            nodeName: '내리리입구',
          },
        ];

        busStops.forEach((busStop) => {
          const { latitude, longitude, nodeName } = busStop;
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(latitude, longitude),
            map: map,
            title: nodeName,
          });
        });

        // Cleanup map instance on component unmount
        return () => map.remove();
      }
    });
  }, []); // Pass an empty dependency array to run this effect only once

  return (
    <div className="main-layout">
      <div id="map" className="map-container"></div>
      <div className="bus-data">
        <h2>Bus Arrival Information</h2>
        {busData.length > 0 ? (
          <ul>
            {busData.map((item, index) => (
              <li key={index}>
                <strong>Remaining Stops:</strong> {item.arrprevstationcnt}
                <br />
                <strong>Estimated Arrival Time:</strong> {item.arrtime}
                <br />
                <strong>Bus Stop Name:</strong> {item.nodenm}
                <br />
                <strong>Bus Number:</strong> {item.routeno}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bus data available.</p>
        )}
      </div>
    </div>
  );
}

export default MainLayout;
