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
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <SocketManager />
      <h1 className="text-4xl font-bold mb-8">Reddit Place Clone</h1>
      {username && <Toolbar />}
      <div className={`relative ${!username ? 'blur-sm' : ''}`} style={{ paddingTop: '60px' }}>
        <Canvas />
      </div>
      {!username && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg">
            {showLogin ? (
              <Login />
            ) : (
              <Signup />
            )}
            <button onClick={() => setShowLogin(!showLogin)} className="mt-4 text-sm text-blue-400 hover:underline">
              {showLogin ? 'Don\'t have an account? Signup' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
