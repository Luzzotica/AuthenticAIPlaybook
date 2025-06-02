"use client";

import { useState, useEffect, useRef } from "react";
import { useBookVars } from "./store/bookVars";
import TextChapter from "./templates/TextChapter";
import { TextChapterProps } from "./types";
import BookNavigation from "./BookNavigation";
import ChapterSelector from "./ChapterSelector";
import { loadAllChapters, ParsedChapter } from "./utils/chapterLoader";

export default function Book() {
  const [chapters, setChapters] = useState<ParsedChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    setBookVar,
    getBookVar,
    getCurrentChapter,
    setCurrentChapter,
    clearAllVars,
  } = useBookVars();

  // Get current chapter index from store
  const chapterIdx = getCurrentChapter();

  // Initialize the single soundtrack
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Don't auto-play, let user choose to start the music
    }
  }, []);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Toggle play/pause
  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.log("Audio playback error:", err);
    }
  };

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
      {/* Single Soundtrack for the entire book */}
      <audio
        ref={audioRef}
        src="/audio/book-soundtrack.mp3"
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        style={{ display: "none" }}
      />

      {/* Audio Controls */}
      <div className="fixed top-4 right-4 z-50 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayback}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
          aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
        >
          {isPlaying ? (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.792L4.91 13.5H3a1 1 0 01-1-1v-3a1 1 0 011-1h1.91l3.473-3.292a1 1 0 011.617.792zM13.5 7.5a1 1 0 011.414 0 3 3 0 010 4.243 1 1 0 11-1.414-1.414 1 1 0 000-1.415 1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Volume control"
          />
          <span className="text-white text-xs w-8 text-center">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

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
