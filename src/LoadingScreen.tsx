const LoadingScreen = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-lg z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4 border border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <h1 className="text-3xl font-bold text-white">
          Connecting to server...
        </h1>
        <p className="text-gray-400 text-center">
          Please wait while we establish a connection.
        </p>
        <p className="text-gray-400 text-center">
          This service runs on a free-tier server and sleeps after inactivity. It is booting up now, which may take up to a minute.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;