import React from 'react';
import { Link } from 'react-router-dom';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-saasha-cream dark:bg-dark-primary p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8 text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 mx-auto text-saasha-brown dark:text-saasha-rose mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        
        <h1 className="text-2xl font-bold text-saasha-brown dark:text-dark-text mb-4">
          Site Under Maintenance
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We're currently performing scheduled maintenance to improve your experience.
          Please check back soon!
        </p>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you an admin? <Link to="/admin" className="text-saasha-rose hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
