// src/components/BusInfo.jsx

import React, { useState, useEffect } from 'react';
import './BusInfo.css';
import { fetchBusArrivalInfo, fetchBusLocationInfo } from './apiService';

const BusInfo = ({  selectedBusStop, gybBusData, dgbBusData, error, hideBusInfo, map , setGybBusData,
  setDgbBusData }) => {

  const [refreshing, setRefreshing] = useState(false);
  const [busMarkers, setBusMarkers] = useState([]);
  

  const createMarker = (map, latitude, longitude, title) => {
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(latitude, longitude),
      map: map,
      title: title,
    }); 
    return marker;
  };

  

  const handleBusItemClick = (routeId, cityCode) => {
    console.log('Clicked Bus Item Route ID:', routeId);
    
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
              const { gpslati, gpslong, nodenm } = location;
              console.log('Creating marker for:', nodenm, gpslati, gpslong);
              return createMarker(map, gpslati, gpslong, nodenm);
            });
            setBusMarkers(newMarkers);
          }
        } else {
          console.log('No bus location data available.');
        }
      })
      .catch((error) => {
        console.error('Error fetching bus location information', error);
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
        console.log('GYB API Response:', gybData);
        console.log('DGB API Response:', dgbData);
        const newGybBusData = gybData.response.body.items.item;
        const newDgbBusData = dgbData.response.body.items.item;
        setGybBusData(newGybBusData);
        setDgbBusData(newDgbBusData);
      })
      .catch((error) => {
        console.error('Error fetching bus arrival information', error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (!map) {
      console.log('Map not available in BusInfo component.');
      return;
    }

  }, [map]);

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
                  <strong>남은 도착시간:</strong> {item.arrtime}
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
        숨김
      </button>
      <div className="bus-data">
        <h2>버스 도착 정보</h2>
        {selectedBusStop ? (
          <div>
            <p>
              <strong>버스정류장:</strong> {selectedBusStop.nodeName}
            </p>
            <p>
              <strong>Node ID:</strong> {selectedBusStop.nodeId}
            </p>
            {error ? (
              <p>{error}</p>
            ) : (
              <div className="bus-arrival-info">
                <h3>버스 도착시간:</h3>
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
                    Refresh
                  </button>
                )}
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
