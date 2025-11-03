
import { useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import useStore from "./store";
import InputFieldWithErrors from "./Components/InputFieldWithErrors";
import { EVENT_NAMES } from "./eventConstants";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setUsername: setStoreUsername } = useStore();
  const socket = useSocket();

  if(!socket) return null;

  const handleSignup = () => {
    socket.emit(EVENT_NAMES.SIGNUP, username);
  };

  useEffect(() => {
    const handleSignupSuccess = () => {
      setStoreUsername(username);
    };

    const handleSignupError = (message: string) => {
      setError(message);
    };

    socket.on(EVENT_NAMES.SIGNUP_SUCCESS, handleSignupSuccess);
    socket.on(EVENT_NAMES.SIGNUP_FAILED, handleSignupError);

    return () => {
      socket.off(EVENT_NAMES.SIGNUP_SUCCESS, handleSignupSuccess);
      socket.off(EVENT_NAMES.SIGNUP_FAILED, handleSignupError);
    };
  }, [username, setStoreUsername, socket]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Join the Canvas</h1>
      <p className="text-gray-400 mb-6 text-center">
        Create your account to start placing pixels and collaborating with
        others.
      </p>
      <div className="flex flex-col space-y-4">
        <InputFieldWithErrors
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSignup();
            }
          }}
          error={error}
        />
        <button
          onClick={handleSignup}
          className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200"
        >
          Create Account
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Each user has a 1-minute cooldown between placing pixels.
      </p>
    </div>
  );
};

export default Signup;
