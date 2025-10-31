import Background from './Background';
import './App.css';
import { useState } from 'react';
import { SocketManager } from './SocketManager';
import Canvas from './Canvas';
import Login from './Login';
import Signup from './Signup';
import useStore from './store';
import Toolbar from './Toolbar';


function App() {
  const { username } = useStore();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="text-white min-h-screen flex flex-col w-full">
      <Background />
      <SocketManager />
      {username && <Toolbar />}
      <div className={`relative w-full flex justify-center ${!username ? 'filter blur-sm' : ''}`}>
        <Canvas />
      </div>
      {!username && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-700 p-8 rounded-lg">
            {showLogin ? (
              <Login />
            ) : (
              <Signup />
            )}
            <div className="flex justify-center">
              <button onClick={() => setShowLogin(!showLogin)} className="mt-4 text-sm text-blue-400 underline cursor-pointer bg-transparent border-none w-full">
                {showLogin ? 'Don\'t have an account? Signup' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
