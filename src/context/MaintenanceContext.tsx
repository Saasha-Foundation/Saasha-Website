import React, { createContext, useContext, useState, useEffect } from 'react';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  toggleMaintenanceMode: () => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    // Check if maintenance mode is active
    const maintenanceStatus = localStorage.getItem('isMaintenanceMode');
    if (maintenanceStatus === 'true') {
      setIsMaintenanceMode(true);
    }
  }, []);

  const toggleMaintenanceMode = () => {
    const newStatus = !isMaintenanceMode;
    setIsMaintenanceMode(newStatus);
    localStorage.setItem('isMaintenanceMode', newStatus.toString());
  };

  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, toggleMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
