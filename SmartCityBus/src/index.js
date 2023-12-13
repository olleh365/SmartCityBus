import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <VehicleProvider>
    <AuthContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthContextProvider>
  </VehicleProvider>
);

