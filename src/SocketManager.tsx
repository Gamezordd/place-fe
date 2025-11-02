import { useEffect } from "react";
import io from "socket.io-client";
import useStore from "./store";
import { EVENT_NAMES } from "./eventConstants";

const socket = io(import.meta.env.VITE_API_URL); // Replace with your backend URL

// Store the interval ID outside the component to ensure it's persistent
let cooldownInterval: number | null = null;

const SocketManager = () => {
  const {
    setCanvas,
    updatePixel,
    setCooldown,
    setInitialized,
    setIsConnected,
  } = useStore();

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

    const handleCooldown = (cooldown: number) => {
      setCooldown(cooldown);

      // Clear any existing interval
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
      }

      if (cooldown > 0) {
        cooldownInterval = setInterval(() => {
          const currentCooldown = useStore.getState().cooldown;
          if (currentCooldown <= 1) {
            clearInterval(cooldownInterval!); // Clear the interval when cooldown ends
            cooldownInterval = null;
            setCooldown(0);
          } else {
            setCooldown(currentCooldown - 1);
          }
        }, 1000);
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleConnectError = () => {
      setIsConnected(false);
    };

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
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
      }
    };
  }, []); // Empty dependency array to run effect only once

  return null;
};

export { socket, SocketManager };
