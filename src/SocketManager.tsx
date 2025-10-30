import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useStore from './store';

const socket = io('localhost:3000'); // Replace with your backend URL

// Store the interval ID outside the component to ensure it's persistent
let cooldownInterval: number | null = null;

const SocketManager = () => {
  const { setCanvas, updatePixel, setCooldown } = useStore();

  useEffect(() => {
    // Define listeners outside to avoid re-creating them on every render
    const handleInitialCanvas = (canvas: any) => {
      setCanvas(canvas);
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
      useStore.getState().setCooldown(cooldown);
      
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
            useStore.getState().setCooldown(0);
          } else {
            useStore.getState().setCooldown(currentCooldown - 1);
          }
        }, 1000);
      }
    };

    socket.on('initial_canvas', handleInitialCanvas);
    socket.on('update_pixel', handleUpdatePixel);
    socket.on('login_success', handleLoginSuccess);
    socket.on('cooldown', handleCooldown);

    return () => {
      socket.off('initial_canvas', handleInitialCanvas);
      socket.off('update_pixel', handleUpdatePixel);
      socket.off('login_failed'); // No specific handler, so just off by event name
      socket.off('signup_failed'); // No specific handler, so just off by event name
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
