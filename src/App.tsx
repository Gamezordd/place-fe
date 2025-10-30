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
    <div style={{ backgroundColor: '#1A202C', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <SocketManager />
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Reddit Place Clone</h1>
      {username && <Toolbar />}
      <div style={{ position: 'relative', paddingTop: '60px', filter: !username ? 'blur(4px)' : 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Canvas />
      </div>
      {!username && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#2D3748', padding: '2rem', borderRadius: '0.5rem' }}>
            {showLogin ? (
              <Login />
            ) : (
              <Signup />
            )}
            <button onClick={() => setShowLogin(!showLogin)} style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#63B3ED', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}>
              {showLogin ? 'Don\'t have an account? Signup' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
