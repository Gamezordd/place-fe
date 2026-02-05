import { create } from "zustand";

interface Pixel {
  color: string;
  timestamp: number;
}

interface Canvas {
  [key: string]: Pixel;
}

// Store the interval ID outside the component to ensure it's persistent
let cooldownInterval: number | null = null;

interface StoreState {
  canvas: Canvas;
  username: string | null;
  cooldown: number;
  preventActivity: boolean;
  selectedColor: string;
  initialized: boolean;
  isConnected: boolean;
  isLoading: boolean;
  setCanvas: (canvas: Canvas) => void;
  setUsername: (username: string | null) => void;
  setCooldown: (cooldown: number) => void;
  setPreventActivity: (preventActivity: boolean) => void;
  setSelectedColor: (color: string) => void;
  updatePixel: (x: number, y: number, color: string, timestamp: number) => void;
  logout: () => void;
  isShaking: boolean;
  setIsShaking: (isShaking: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  checkServerHealth: () => Promise<true | undefined>;
  handleCooldown: (cooldown: number) => void;
}

const useStore = create<StoreState>((set, get) => ({
  canvas: {},
  username: null,
  cooldown: 0,
  selectedColor: "#000000",
  initialized: false,
  isConnected: false,
  isLoading: true,
  preventActivity: false,
  setPreventActivity: (preventActivity) => set({ preventActivity }),
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
      preventActivity: true,
    })),
  logout: () => set({ username: null }),
  isShaking: false,
  setIsShaking: (isShaking) => set({ isShaking }),
  setInitialized: (initialized) => set({ initialized }),
  setIsConnected: (isConnected) => set({ isConnected }),
  handleCooldown: (cooldown: number) => {
    set({ cooldown });

    // Clear any existing interval
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }

    if (cooldown > 0) {
      cooldownInterval = setInterval(() => {
        const currentCooldown = get().cooldown;
        if (currentCooldown <= 1) {
          clearInterval(cooldownInterval!); // Clear the interval when cooldown ends
          cooldownInterval = null;
          set({ cooldown: 0, preventActivity: false }); // Reset cooldown and allow activity
        } else {
          set({ cooldown: currentCooldown - 1 }); // Decrement cooldown by 1 second
        }
      }, 1000);
    }
  },
  checkServerHealth: async () => {
    const doCheck = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/health");
        if (response) {
          set({ isLoading: false });
          return true;
        }
      } catch (error) {
        console.error("Health check failed:", error);
        setTimeout(doCheck, 10000);
      }
    };
    return doCheck();
  },
}));
export default useStore;
