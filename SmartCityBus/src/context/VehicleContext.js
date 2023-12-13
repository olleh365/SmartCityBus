// src/context/VehicleContext.jsx
import { createContext, useState } from 'react';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [selectedVehicleno, setSelectedVehicleno] = useState(null);

  const setVehicleno = (vehicleno) => {
    setSelectedVehicleno(vehicleno.toString());
  };

  return (
    <VehicleContext.Provider value={{ selectedVehicleno, setVehicleno }}>
      {children}
    </VehicleContext.Provider>
  );
};
