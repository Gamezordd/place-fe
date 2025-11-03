import Background from "./Background";
import "./App.css";
import { useState } from "react";
import { useSocket } from "./useSocket";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));
import useStore from "./store";
import Toolbar from "./Toolbar";
import ConnectionError from "./ConnectionError";
const KonvaCanvas = lazy(() => import("./KonvaCanvas"));

import LoadingScreen from "./LoadingScreen";

function App() {
  const { username, isConnected, isLoading } = useStore();

  useSocket();

  const [showLogin, setShowLogin] = useState(true);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isConnected) {
    return <ConnectionError />;
  }

  return (
    <div className="text-white min-h-screen flex flex-col w-full">
      <Background />
      {username && <Toolbar />}
      <div className={`relative w-full flex justify-center items-center `}>
        <Suspense fallback={<div>Loading Canvas...</div>}>
          <KonvaCanvas />
        </Suspense>
      </div>
      {!username && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-lg">
          <div className="bg-gray-700/50 p-8 rounded-lg">
            {showLogin ? <Login /> : <Signup />}
            <div className="flex justify-center">
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="mt-4 text-sm text-blue-400 underline cursor-pointer bg-transparent border-none w-full"
              >
                {showLogin
                  ? "Don't have an account? Signup"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
