"use client";

import { useState, useEffect } from "react";
import { useBookVars } from "./store/bookVars";
import TextChapter from "./templates/TextChapter";
import BookNavigation from "./BookNavigation";
import ChapterSelector from "./ChapterSelector";
import AudioPlayer from "./components/AudioPlayer";
import { loadAllChapters, ParsedChapter } from "./utils/chapterLoader";

export default function Book() {
  const [chapters, setChapters] = useState<ParsedChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    setBookVar,
    getBookVar,
    getCurrentChapter,
    setCurrentChapter,
    clearAllVars,
  } = useBookVars();

  // Get current chapter index from store
  const chapterIdx = getCurrentChapter();

  // Track the furthest chapter the user has reached
  useEffect(() => {
    const furthestChapter = getBookVar("furthestChapter") || 0;
    if (chapterIdx > furthestChapter) {
      setBookVar("furthestChapter", chapterIdx);
    }
  }, [chapterIdx, getBookVar, setBookVar]);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterIdx]);

  // Load chapters from markdown files on component mount
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true);
        const loadedChapters = await loadAllChapters();
        setChapters(loadedChapters);
        setError(null);
      } catch (err) {
        console.error("Failed to load chapters:", err);
        setError("Failed to load chapters. Please try again.");
        // Fallback to default chapters if loading fails
        setChapters([
          {
            content:
              "It was a dark and stormy night. The rain tapped gently on the window, and you felt the weight of the story about to unfold...",
            slug: "fallback-1",
            type: "markdown",
          },
          {
            content:
              "The next morning, sunlight streamed through the curtains, promising a new beginning.",
            slug: "fallback-2",
            type: "markdown",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);

  const chapter = chapters[chapterIdx];

  // Check if navigation should be disabled
  const isNavigationDisabled = () => {
    if (!chapter) return false;

    // Disable forward navigation on name input chapter if no name or email is set
    if (chapter.slug === "name-input") {
      const name = getBookVar("name");
      const email = getBookVar("email");
      return !name || name.trim() === "" || !email || email.trim() === "";
    }

    return false;
  };

  const nextChapter = () => {
    if (chapterIdx < chapters.length - 1 && !isNavigationDisabled()) {
      const newIdx = chapterIdx + 1;
      setCurrentChapter(newIdx);
    }
  };

  const prevChapter = () => {
    if (chapterIdx > 0) {
      const newIdx = chapterIdx - 1;
      setCurrentChapter(newIdx);
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapter(index);
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-white text-lg">Loading chapters...</div>
      </div>
    );
  }

  if (error && chapters.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-white text-lg">No chapters available.</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Audio Player Component */}
      <AudioPlayer />

      {/* Chapter Selector Hamburger Menu */}
      <ChapterSelector
        chapters={chapters}
        currentChapterIdx={chapterIdx}
        onChapterSelect={handleChapterSelect}
        getBookVar={getBookVar}
      />

      <div className="w-full flex justify-center">
        <div className="w-full md:w-4/5 px-4 md:px-0 pb-32">
          <TextChapter
            {...chapter}
            nextChapter={nextChapter}
            prevChapter={prevChapter}
            setBookVar={setBookVar}
            getBookVar={getBookVar}
            clearAllVars={clearAllVars}
            chapterIndex={chapterIdx}
          />
        </div>
      </div>
      <BookNavigation
        nextChapter={nextChapter}
        prevChapter={prevChapter}
        isFirst={chapterIdx === 0}
        isLast={chapterIdx === chapters.length - 1}
        isNextDisabled={isNavigationDisabled()}
      />
    </div>
  );
}
