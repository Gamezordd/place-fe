import { useState, useEffect } from 'react';
import { socket } from './SocketManager';
import useStore from './store';

const Signup = () => {
  const [username, setUsername] = useState('');
  const { setUsername: setStoreUsername } = useStore();

  const handleSignup = () => {
    socket.emit('signup', username);
  };

  useEffect(() => {
    const handleSignupSuccess = () => {
      setStoreUsername(username);
    };

    socket.on('signup_success', handleSignupSuccess);

    return () => {
      socket.off('signup_success', handleSignupSuccess);
    };
  }, [username, setStoreUsername]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-700 text-white"
        />
        <button
          onClick={handleSignup}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
