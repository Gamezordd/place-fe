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
    <div>
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-700 text-white"
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
