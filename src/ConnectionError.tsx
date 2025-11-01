import React from 'react';

const ConnectionError = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-lg">
      <div className="bg-gray-700/50 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-red-500">Connection Error</h1>
        <p className="text-gray-400 mb-6 text-center">Could not connect to the server. Please try again later.</p>
      </div>
    </div>
  );
};

export default ConnectionError;
