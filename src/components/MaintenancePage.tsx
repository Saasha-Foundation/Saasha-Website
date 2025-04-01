import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const MaintenancePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-saasha-cream dark:bg-dark-primary p-4 text-center">
      <div className="max-w-md">
        <div className="mb-8">
          <img 
            src={isDarkMode ? "/logo-dark.png" : "/logo.png"} 
            alt="Saasha Foundation Logo" 
            className="h-24 mx-auto"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-saasha-brown dark:text-dark-text mb-4">
          We're Under Maintenance
        </h1>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          We're currently performing some scheduled maintenance on our website. 
          We'll be back online shortly. Thank you for your patience.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/admin" 
            className="px-6 py-2 bg-saasha-brown text-white rounded-md hover:bg-saasha-brown/90 transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
