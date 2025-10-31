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
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Join the Canvas</h1>
      <p className="text-gray-400 mb-6 text-center">Create your account to start placing pixels and collaborating with others.</p>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
        <button
          onClick={handleSignup}
          className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200"
        >
          Create Account
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">Each user has a 1-minute cooldown between placing pixels.</p>
    </div>
  );
};

export default Signup;
