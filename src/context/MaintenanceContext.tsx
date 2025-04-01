import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

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
        // First check if the site_settings table exists
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .maybeSingle();

        if (error) {
          console.error('Error fetching maintenance mode:', error);
          // Default to false if there's an error
          setIsMaintenanceMode(false);
        } else {
          // If the setting exists, use it; otherwise default to false
          setIsMaintenanceMode(data?.value === 'true');
          console.log('Maintenance mode status:', data?.value === 'true');
        }
      } catch (err: any) {
        console.error('Error in fetchMaintenanceStatus:', err);
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
      console.log('Toggling maintenance mode to:', newValue);
      
      // Check if the setting already exists
      const { data: existingData } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'maintenance_mode')
        .maybeSingle();
      
      let result;
      
      if (existingData?.id) {
        // Update existing setting
        result = await supabase
          .from('site_settings')
          .update({ 
            value: newValue.toString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new setting
        result = await supabase
          .from('site_settings')
          .insert({ 
            key: 'maintenance_mode', 
            value: newValue.toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Update local state
      setIsMaintenanceMode(newValue);
      toast.success(`Maintenance mode ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      console.error('Error toggling maintenance mode:', err);
      setError(err.message || 'Failed to toggle maintenance mode');
      toast.error('Failed to toggle maintenance mode');
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
