import { create } from "zustand";

interface Pixel {
  color: string;
  timestamp: number;
}

interface Canvas {
  [key: string]: Pixel;
}

interface StoreState {
  canvas: Canvas;
  username: string | null;
  cooldown: number;
  selectedColor: string;
  initialized: boolean;
  isConnected: boolean;
  setCanvas: (canvas: Canvas) => void;
  setUsername: (username: string | null) => void;
  setCooldown: (cooldown: number) => void;
  setSelectedColor: (color: string) => void;
  updatePixel: (x: number, y: number, color: string, timestamp: number) => void;
  logout: () => void;
  isShaking: boolean;
  setIsShaking: (isShaking: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  canvas: {},
  username: null,
  cooldown: 0,
  selectedColor: "#FFFFFF",
  initialized: false,
  isConnected: true,
  setCanvas: (canvas) => set({ canvas }),
  setUsername: (username) => set({ username }),
  setCooldown: (cooldown) => set({ cooldown }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  updatePixel: (x, y, color, timestamp) =>
    set((state) => ({
      canvas: {
        ...state.canvas,
        [`${x}:${y}`]: { color, timestamp },
      },
    })),
  logout: () => set({ username: null }),
  isShaking: false,
  setIsShaking: (isShaking) => set({ isShaking }),
  setInitialized: (initialized) => set({ initialized }),
  setIsConnected: (isConnected) => set({ isConnected }),
}));

export default useStore;
