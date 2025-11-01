import { useState, useEffect } from 'react';
import { socket } from './SocketManager';
import useStore from './store';
import InputFieldWithErrors from './Components/InputFieldWithErrors';

const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setUsername: setStoreUsername } = useStore();

  const handleLogin = () => {
    socket.emit('login', username);
  };

  useEffect(() => {
    const handleLoginSuccess = () => {
      setStoreUsername(username);
    };

    const handleLoginError = (message: string) => {
      setError(message);
    };

    socket.on('login_success', handleLoginSuccess);
    socket.on('login_failed', handleLoginError);

    return () => {
      socket.off('login_success', handleLoginSuccess);
      socket.off('login_failed', handleLoginError);
    };
  }, [username, setStoreUsername]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Reddit Place Clone</h1>
      <p className="text-gray-400 mb-6 text-center">Collaborate with others to create a masterpiece on a shared canvas.</p>
      <div className="flex flex-col space-y-4">
        <InputFieldWithErrors
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
          error={error}
        />
        <button
          onClick={handleLogin}
          className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200"
        >
          Login
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">Each user has a 1-minute cooldown between placing pixels.</p>
    </div>
  );
};

export default Login;
