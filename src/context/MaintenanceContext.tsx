import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  toggleMaintenanceMode: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the maintenance mode status from Supabase on initial load
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .single();

        if (error) throw error;
        
        // If the setting exists, use it; otherwise default to false
        setIsMaintenanceMode(data?.value === 'true');
      } catch (err: any) {
        console.error('Error fetching maintenance mode status:', err);
        // If the table or row doesn't exist yet, we'll create it when toggling
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  const toggleMaintenanceMode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newValue = !isMaintenanceMode;
      
      // Update or insert the maintenance mode setting
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'maintenance_mode', 
          value: newValue.toString(),
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'key' 
        });

      if (error) throw error;
      
      setIsMaintenanceMode(newValue);
    } catch (err: any) {
      console.error('Error toggling maintenance mode:', err);
      setError(err.message || 'Failed to toggle maintenance mode');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, toggleMaintenanceMode, isLoading, error }}>
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
