// src/components/apiService.js

import axios from 'axios';

export const fetchBusArrivalInfo = async (nodeId, cityCode, serviceKey) => {
  try {
    const apiUrl = 'http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList';
    const params = {
      serviceKey: decodeURIComponent(serviceKey), // 인증키 디코딩
      _type: 'json',
      nodeId: nodeId,
      cityCode: cityCode,
    };

    const response = await axios.get(apiUrl, { params });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Error fetching bus arrival information');
  } catch (error) {
    throw new Error('Error fetching bus arrival information');
  }
};

export const fetchBusLocationInfo = async (routeId, cityCode, serviceKey) => {
  try {
    const apiUrl = 'http://apis.data.go.kr/1613000/BusLcInfoInqireService/getRouteAcctoBusLcList';
    const params = {
      serviceKey: decodeURIComponent(serviceKey),
      _type: 'json',
      routeId: routeId,
      cityCode: cityCode,
    };

    const response = await axios.get(apiUrl, { params });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Error fetching bus location information');
  } catch (error) {
    throw new Error('Error fetching bus location information');
  }
};
