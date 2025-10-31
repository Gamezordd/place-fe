import { create } from 'zustand';

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
  setCanvas: (canvas: Canvas) => void;
  setUsername: (username: string | null) => void;
  setCooldown: (cooldown: number) => void;
  setSelectedColor: (color: string) => void;
  updatePixel: (x: number, y: number, color: string, timestamp: number) => void;
  logout: () => void;
  isShaking: boolean;
  setIsShaking: (isShaking: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  canvas: {},
  username: null,
  cooldown: 0,
  selectedColor: '#FFFFFF',
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
}));

export default useStore;