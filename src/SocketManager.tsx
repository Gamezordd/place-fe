import { useEffect } from 'react';
import io from 'socket.io-client';
import useStore from './store';

const socket = io('localhost:3000'); // Replace with your backend URL

// Store the interval ID outside the component to ensure it's persistent
let cooldownInterval: number | null = null;

const SocketManager = () => {
  const { setCanvas, updatePixel, setCooldown, setInitialized, setIsConnected } = useStore();

  useEffect(() => {
    // Define listeners outside to avoid re-creating them on every render
    const handleInitialCanvas = (canvas: any) => {
      setCanvas(canvas);
      setInitialized(true);
    };

    const handleUpdatePixel = (data: { x: number; y: number; color: string; timestamp: number }) => {
      const { x, y, color, timestamp } = data;
      updatePixel(x, y, color, timestamp);
    };

    const handleLoginSuccess = () => {
      // Backend now sends 'cooldown' event directly after login
    };

    const handleCooldown = (cooldown: number) => {
      console.log("current cooldown:", cooldown);
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

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('initial_canvas', handleInitialCanvas);
    socket.on('update_pixel', handleUpdatePixel);
    socket.on('login_success', handleLoginSuccess);
    socket.on('cooldown', handleCooldown);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('initial_canvas', handleInitialCanvas);
      socket.off('update_pixel', handleUpdatePixel);
      socket.off('cooldown', handleCooldown);
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
      }
    };
  }, []); // Empty dependency array to run effect only once

  return null;
};

export { socket, SocketManager };
