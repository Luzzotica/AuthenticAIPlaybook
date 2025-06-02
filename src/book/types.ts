export interface BookChapterProps {
  nextChapter: () => void;
  prevChapter: () => void;
  setBookVar: (key: string, value: any) => void;
  getBookVar: (key: string) => any;
  clearAllVars: () => void;
}

export interface TextChapterProps {
  content: string | React.ReactNode;
  backgroundImage?: string;
  backgroundAnimation?: React.ReactNode;
  textEffect?: "typewriter" | "none";
  textEffectSpeed?: number;
}
