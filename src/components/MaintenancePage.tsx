import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-saasha-cream dark:bg-dark-primary p-4 text-center">
      <div className="max-w-md">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-saasha-brown dark:text-dark-text font-serif">
            saasha
          </h1>
        </div>
        
        <h2 className="text-3xl font-bold text-saasha-brown dark:text-dark-text mb-4">
          We're Under Maintenance
        </h2>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          We're currently performing some scheduled maintenance on our website. 
          We'll be back online shortly. Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
