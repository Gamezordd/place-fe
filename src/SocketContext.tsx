import React, { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import useSocketConnection from "./useSocket";

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useSocketConnection();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};