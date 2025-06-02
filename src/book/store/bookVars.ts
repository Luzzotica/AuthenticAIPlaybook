import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookVars = Record<string, any>;

interface BookVarsStore {
  vars: BookVars;
  currentChapterIdx: number;
  setBookVar: (key: string, value: any) => void;
  getBookVar: (key: string) => any;
  setCurrentChapter: (index: number) => void;
  getCurrentChapter: () => number;
  clearAllVars: () => void;
}

export const useBookVars = create<BookVarsStore>()(
  persist(
    (set, get) => ({
      vars: {},
      currentChapterIdx: 0,
      setBookVar: (key, value) =>
        set((state) => ({ vars: { ...state.vars, [key]: value } })),
      getBookVar: (key) => get().vars[key],
      setCurrentChapter: (index) => set({ currentChapterIdx: index }),
      getCurrentChapter: () => get().currentChapterIdx,
      clearAllVars: () => set({ vars: {}, currentChapterIdx: 0 }),
    }),
    {
      name: "book-vars",
    }
  )
);
