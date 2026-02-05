
import { useEffect, useMemo } from "react";
import useStore from "./store";
import { EVENT_NAMES } from "./eventConstants";
import { io } from "socket.io-client";



const useSocketConnection = () => {
  const {
    setCanvas,
    updatePixel,
    handleCooldown,
    setInitialized,
    setIsConnected,
    checkServerHealth,
    isConnected,
    isLoading
  } = useStore();

    const socket = useMemo(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      autoConnect: false,
    });
    return newSocket;
  }, []);

  useEffect(() => {
    return () => {
      console.log("SocketProvider disconnecting socket");
      socket.disconnect();
    }
  }, [socket]);

  useEffect(() => {
    const reconnect = async () => {
      const serverUp = await checkServerHealth();
      if (serverUp && !isConnected && socket) {
        const { connected } = socket.connect();
        if (connected) {
          console.log("Socket reconnected");
          setIsConnected(true);
        }
      }
    };
    reconnect();
  }, [socket, isConnected, isLoading, checkServerHealth, setIsConnected]);

  useEffect(() => {
    // Define listeners outside to avoid re-creating them on every render
    const handleInitialCanvas = (canvas: any) => {
      setCanvas(canvas);
      setInitialized(true);
    };

    const handleUpdatePixel = (data: {
      x: number;
      y: number;
      color: string;
      timestamp: number;
    }) => {
      const { x, y, color, timestamp } = data;
      updatePixel(x, y, color, timestamp);
    };

    const handleLoginSuccess = () => {
      // Backend now sends 'cooldown' event directly after login
    };

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleConnectError = () => {
      setIsConnected(false);
    };

    if(!socket) return;

    socket.on(EVENT_NAMES.CONNECT, handleConnect);
    socket.on(EVENT_NAMES.CONNECT_ERROR, handleConnectError);
    socket.on(EVENT_NAMES.INITIAL_CANVAS, handleInitialCanvas);
    socket.on(EVENT_NAMES.UPDATE_PIXEL, handleUpdatePixel);
    socket.on(EVENT_NAMES.LOGIN_SUCCESS, handleLoginSuccess);
    socket.on(EVENT_NAMES.COOLDOWN, handleCooldown);

    return () => {
      socket.off(EVENT_NAMES.CONNECT, handleConnect);
      socket.off(EVENT_NAMES.CONNECT_ERROR, handleConnectError);
      socket.off(EVENT_NAMES.INITIAL_CANVAS, handleInitialCanvas);
      socket.off(EVENT_NAMES.UPDATE_PIXEL, handleUpdatePixel);
      socket.off(EVENT_NAMES.COOLDOWN, handleCooldown);
    };
  }, [socket]);

  return socket;
};

export default useSocketConnection;

