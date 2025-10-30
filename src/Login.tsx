import { useState, useEffect } from 'react';
import { socket } from './SocketManager';
import useStore from './store';

const Login = () => {
  const [username, setUsername] = useState('');
  const { setUsername: setStoreUsername } = useStore();

  const handleLogin = () => {
    socket.emit('login', username);
  };

  useEffect(() => {
    const handleLoginSuccess = () => {
      setStoreUsername(username);
    };

    socket.on('login_success', handleLoginSuccess);

    return () => {
      socket.off('login_success', handleLoginSuccess);
    };
  }, [username, setStoreUsername]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
        <button
          onClick={handleLogin}
          className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
