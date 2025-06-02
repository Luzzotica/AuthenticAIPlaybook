import { create } from "zustand";

export type Scene = {
  id: number;
  title: string;
  completed: boolean;
  unlocked: boolean;
};

interface GameState {
  currentScene: number;
  scenes: Scene[];
  progress: number;
  setCurrentScene: (sceneId: number) => void;
  completeScene: (sceneId: number) => void;
  unlockScene: (sceneId: number) => void;
  updateProgress: (progress: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentScene: 1,
  progress: 0,
  scenes: [
    {
      id: 1,
      title: "The Voice That Broke Me",
      completed: false,
      unlocked: true,
    },
    {
      id: 2,
      title: "The Epiphany: Use It Like Google",
      completed: false,
      unlocked: false,
    },
    {
      id: 3,
      title: "FEED: The Voice Upload",
      completed: false,
      unlocked: false,
    },
    {
      id: 4,
      title: "FORMAT: Your Voice Has Structure",
      completed: false,
      unlocked: false,
    },
    {
      id: 5,
      title: "ITERATE: From 70% to 90% You",
      completed: false,
      unlocked: false,
    },
  ],
  setCurrentScene: (sceneId) => set({ currentScene: sceneId }),
  completeScene: (sceneId) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, completed: true } : scene
      ),
    })),
  unlockScene: (sceneId) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, unlocked: true } : scene
      ),
    })),
  updateProgress: (progress) => set({ progress }),
}));
