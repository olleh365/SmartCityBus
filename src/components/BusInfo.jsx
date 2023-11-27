// src/components/BusInfo.jsx

import React, { useState, useEffect, useContext } from 'react';
import './BusInfo.css';
import { fetchBusArrivalInfo, fetchBusLocationInfo } from './apiService';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { VehicleContext } from '../context/VehicleContext';



let currentInfowindow = null;

const BusInfo = ({  selectedBusStop, gybBusData, dgbBusData, error, hideBusInfo, map , setGybBusData,
  setDgbBusData }) => {
    const navigate = useNavigate();
    const { setVehicleno } =  useContext(VehicleContext);

  const [refreshing, setRefreshing] = useState(false);
  const [busMarkers, setBusMarkers] = useState([]);
  const [loading, setLoading] = useState(false);


  const createMarker = (map, latitude, longitude, title, vehicleno) => {

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(latitude, longitude),
      map: map,
      title: title,
    }); 
    const iwRemoveable = true;
    const infowindow = new window.kakao.maps.InfoWindow({
      content:[
        '<div class="info-window">',
        '<p>'+ '<' + vehicleno+ '>'+'</p>',
        '<div id="congestion-info"></div>',
        '<button class= "info-button" data-action="navigate-to-chathome">채팅방</button>',
    '</div>',
  ].join('')
    , removable : iwRemoveable,
    });
    
    window.kakao.maps.event.addListener(marker, 'click', function () {
      if (currentInfowindow) {
        currentInfowindow.close();
      }
      setVehicleno(vehicleno);
      fetchCongestionInfo(vehicleno, infowindow, map, marker);

      currentInfowindow = infowindow;
    });

    return marker;
  };
  const fetchCongestionInfo = (vehicleno, infowindow, map, marker) => {
    try {
      const docRef = doc(db, "vehicleno", vehicleno.toString());
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const vehicleData = docSnapshot.data();
          console.log('Vehicle Data:', vehicleData);

          const congestionLevel = vehicleData.congestion;
          const congestionText = getCongestionText(congestionLevel);

          const congestionInfo = document.getElementById('congestion-info');
          if (congestionInfo) {
            congestionInfo.innerHTML = `<strong>혼잡도:</strong> ${congestionText}`;
          }
        } else {
          console.log('db에 vehicleno 데이터를 가져올 수 없음: ', vehicleno);
        }
      });
  
      infowindow.addListener('closeclick', function () {
        unsubscribe();
      });
      
    } catch (error) {
      console.error('Firestore error:', error);
    }
    infowindow.open(map, marker);
  };
  
  const getCongestionText = (congestionLevel) => {
    if (congestionLevel <= 1) {
      return '😄';
    } else if (congestionLevel === 2) {
      return '😐';
    } else {
      return '🤯';
    }
  };

  const handleBusItemClick = (routeId, cityCode) => {
    setLoading(true); 

    busMarkers.forEach((marker) => marker.setMap(null));
    setBusMarkers([]);

    fetchBusLocationInfo(routeId, cityCode, process.env.REACT_APP_API_KEY)
      .then((data) => {
        let busLocationData = data.response.body.items.item;
        console.log('busLocationData : ',busLocationData);

        if (!Array.isArray(busLocationData)) {
          busLocationData = [busLocationData];
        }


        if (busLocationData.length > 0) {
          if (map) {
            const newMarkers = busLocationData.map((location) => {
              const { gpslati, gpslong, nodenm, vehicleno } = location;
              return createMarker(map, gpslati, gpslong, nodenm, vehicleno);
            });
            setBusMarkers(newMarkers);
          }
        } else {
          console.log('No bus location data available.');
        }
      })
      .catch((error) => {
        console.error('버스위치정보 서버가 끊겼습니다.', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
  
    const gybCityCode = selectedBusStop.gybCityCode;
    const dgbCityCode = selectedBusStop.dgbCityCode; 
    const gybNodeId = selectedBusStop.gybNodeId;
    const dgbNodeId = selectedBusStop.dgbNodeId;
  
    Promise.all([
      fetchBusArrivalInfo(gybNodeId, gybCityCode, process.env.REACT_APP_API_KEY),
      fetchBusArrivalInfo(dgbNodeId, dgbCityCode, process.env.REACT_APP_API_KEY)
    ])
      .then(([gybData, dgbData]) => {
        const newGybBusData = gybData.response.body.items.item;
        const newDgbBusData = dgbData.response.body.items.item;
        setGybBusData(newGybBusData);
        setDgbBusData(newDgbBusData);
      })
      .catch((error) => {
        console.error('버스도착정보 서버가 끊겼습니다.', error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
  const handleClick = (event) => {
    const target = event.target;

    if (target && target.dataset.action === 'navigate-to-chathome') {
      navigate('/chathome');
    }
  };

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
}, [navigate]);

const formatArrivalTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if(seconds>= 60){
    return `${minutes}분 ${remainingSeconds}초`;
  }else{
    return `${remainingSeconds}초`;
  }
};

  const renderBusData = (data, cityCode) => {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return (
      <ul>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <li
              key={index}
              className="bus-item"
              onClick={() => handleBusItemClick(item.routeid, cityCode)}
            >
              {item && item.routeno ? (
                <>
                  <strong></strong> <strong>{item.routeno} 버스</strong>
                  <br />
                </>
              ) : (
                'No bus location data available.'
              )}
              {item && item.vehicletp ? (
                <>
                  <strong></strong> {item.vehicletp}
                  <br />
                </>
              ) : null}
              {item && item.arrprevstationcnt ? (
                <>
                  <strong>남은 정류장:</strong> {item.arrprevstationcnt}
                  <br />
                </>
              ) : (
                ''
              )}
              {item && item.arrtime ? (
                <>
                  <strong>남은 도착시간:</strong> {formatArrivalTime(item.arrtime)}
                  <br />
                </>
              ) : null}
            </li>
          ))
        ) : (
          <p>No bus location data available</p>
        )}
      </ul>
    );
  };

  
  return (
    <div className={'bus-info-container'}>
      <button className="hide-button" onClick={hideBusInfo}>
        X
      </button>
      <div className="bus-data">
        <h2>버스 도착 정보</h2>
        {selectedBusStop ? (
          <div>
            <p>
              <strong>버스정류장:</strong> {selectedBusStop.nodeName}
            </p>
            {refreshing ? (
                  <div className="centered-spinner">
                    <span className="loading-indicator">
                      <img src="/busLogo.png" className="loading-image" />
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRefresh()}
                    className="refresh-button"
                  >
                    ↺
                  </button>
                )}
            {loading ? (
              <div className="centered-spinner">
                <span className="loading-indicator">
                  <img src="/busLogo.png" className="loading-image" alt="Loading" />
                </span>
              </div>
            ) : (
              <div className="bus-arrival-info">
                <h3>버스 도착시간:</h3>
                {renderBusData(gybBusData, '37100')}
                {renderBusData(dgbBusData, '22')}
              </div>
            )}
          </div>
        ) : (
          <p>No bus stop selected.</p>
        )}
      </div>
    </div>
  );
};



export default BusInfo;
