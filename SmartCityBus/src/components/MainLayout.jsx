// src/components/MainLayout.jsx

/* global kakao */
import React, { useEffect, useState, useRef } from 'react';
import BusInfo from './BusInfo';
import Sidebar from './Sidebar';
import { fetchBusArrivalInfo } from './apiService';
import './MainLayout.css';


const MainLayout = () => {
  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const [showBusInfo, setShowBusInfo] = useState(false);
  const [error, setError] = useState(null);
  const [gybBusData, setGybBusData] = useState([]);
  const [dgbBusData, setDgbBusData] = useState([]);
  const serviceKey = process.env.REACT_APP_API_KEY; 

  const mapRef = useRef(null);

  const mapTypes = {
    terrain: window.kakao.maps.MapTypeId.TERRAIN,
    traffic: window.kakao.maps.MapTypeId.TRAFFIC,
    bicycle: window.kakao.maps.MapTypeId.BICYCLE,
  };

  const [mapTypeChecked, setMapTypeChecked] = useState({
    terrain: true,
    traffic: true,
    bicycle: true,
  });


  const toggleMapType = (mapType) => {
    if (mapRef.current) {
      if (mapTypeChecked[mapType]) {
        mapRef.current.addOverlayMapTypeId(mapTypes[mapType]);
      } else {
        mapRef.current.removeOverlayMapTypeId(mapTypes[mapType]);
      }
    }
  };

  const handleOverlayCheckbox = (mapType) => {
    const updatedMapTypeChecked = { ...mapTypeChecked };
    updatedMapTypeChecked[mapType] = !updatedMapTypeChecked[mapType];
    setMapTypeChecked(updatedMapTypeChecked);

    toggleMapType(mapType);
  };

  const busStops = [
    {
      gybNodeId: 'GYB360021000',
      gybCityCode : '37100',
      dgbNodeId: 'DGB7121021000',
      dgbCityCode : '22',
      latitude: 35.8992,
      longitude: 128.8426,
      nodeName: '대구대서문',
    },
    {
      gybNodeId: 'GYB360019000',
      gybCityCode : '37100',
      dgbNodeId: 'DGB7121008200',
      dgbCityCode : '22',
      latitude: 35.9012,
      longitude: 128.826,
      nodeName: '대구대삼거리(대구대방향)',
    },
    {
      gybNodeId: 'GYB360021100',
      gybCityCode : '37100',
      dgbNodeId: 'DGB7121021100',
      dgbCityCode : '22',
      latitude: 35.8971,
      longitude: 128.8498,
      nodeName: '대구대(정문1)',
    },
    {
      gybNodeId: 'GYB360008400',
      gybCityCode : '37100',
      dgbNodeId: 'DGB7121008400',
      dgbCityCode : '22',
      latitude: 35.9011,
      longitude: 128.8335,
      nodeName: '상림리',
    },
    {
      gybNodeId: 'GYB360052353',
      gybCityCode : '37100',
      dgbNodeId: 'DGB3600107200',
      dgbCityCode : '22',
      latitude: 35.90043207,
      longitude: 128.837831,
      nodeName: '내리리입구',
    },
    {
      gybNodeId: 'GYB360052535',
      gybCityCode : '37100',
      dgbCityCode : '22',
      latitude: 35.90252348,
      longitude: 128.84930441,
      nodeName: '창파도서관',
    },
    {
      gybNodeId: 'GYB360006300',
      gybCityCode : '37100',
      dgbNodeId: 'DGB7121006300',
      dgbCityCode : '22',
      latitude: 35.9104,
      longitude: 128.8151,
      nodeName: '하양역1 건너',
    },
  ];

  const hideBusInfo = () => {
    setShowBusInfo(false);
    setSelectedBusStop(null);
  };

  const handleBusStopClick = (busStop) => {
    setSelectedBusStop(busStop);

    const gybNodeID = busStop.gybNodeId;
    const dgbNodeID = busStop.dgbNodeId;

    const gybCityCode = '37100'; 
    const dgbCityCode = '22';

    fetchBusArrivalInfo(gybNodeID, gybCityCode, serviceKey)
      .then((gybData) => {
        setGybBusData(gybData.response.body.items.item);
        setError(null);
        console.log('GYB Data:', gybData);
      })
      .catch((gybError) => {
        setError('Error fetching GYB bus arrival information');
        console.error(gybError);
      });

    fetchBusArrivalInfo(dgbNodeID, dgbCityCode, serviceKey)
      .then((dgbData) => {
        setDgbBusData(dgbData.response.body.items.item);
        setError(null);
        console.log('DGB Data:', dgbData);
      })
      .catch((dgbError) => {
        setError('Error fetching DGB bus arrival information');
        console.error(dgbError);
      });

    setShowBusInfo(true);
  };
  

  
  useEffect(() => {
    if (!mapRef.current) {
      const options = {
        center: new window.kakao.maps.LatLng(35.9025, 128.8355),
        level: 5,
      };

      const map = new window.kakao.maps.Map(document.getElementById('map'), options);


      mapRef.current = map;

      busStops.forEach((busStop) => {
        const { latitude, longitude, nodeName } = busStop;
        const imageSrc = '/bus_station.png';
        const imageSize = new kakao.maps.Size(40, 40);
        const imageOption = {offset: new kakao.maps.Point(26, 26)};
        const markerImage = new kakao.maps.MarkerImage
        (imageSrc, imageSize, imageOption);
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(latitude, longitude),
          map: map,
          title: nodeName,
          image: markerImage,
        });

        const infowindow = new kakao.maps.InfoWindow({
          content : '<div style="width:150px;text-align:center;font-weight:bold; padding: 5px;">'+nodeName+'</div>'
      });

      kakao.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.open(map, marker);
      });
      
      kakao.maps.event.addListener(marker, 'mouseout', function() {
          infowindow.close();
      });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          handleBusStopClick(busStop);
        });
      });
    }
  }, [busStops, handleBusStopClick]);



  return (
    <div className="main-layout">
      <div id="map" className="map-container"></div>
      <Sidebar onOverlayCheckboxChange={handleOverlayCheckbox} mapTypeChecked={mapTypeChecked} />
      {mapRef.current && (
        <React.Fragment>
          {showBusInfo && (
            <BusInfo
              selectedBusStop={selectedBusStop}
              gybBusData={gybBusData}
              dgbBusData={dgbBusData}
              error={error}
              hideBusInfo={hideBusInfo}
              setGybBusData={setGybBusData}
              setDgbBusData={setDgbBusData}
              map={mapRef.current}
            />
          )}
        </React.Fragment> 
      )}
    </div>
  );
}

export default MainLayout;
