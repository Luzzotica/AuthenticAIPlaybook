"use client";

import { useState, useEffect, useRef } from "react";
import { useBookVars } from "./store/bookVars";
import TextChapter from "./templates/TextChapter";
import BookNavigation from "./BookNavigation";
import ChapterSelector from "./ChapterSelector";
import { loadAllChapters, ParsedChapter } from "./utils/chapterLoader";

export default function Book() {
  const [chapters, setChapters] = useState<ParsedChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // Default to 30%
  const [isMuted, setIsMuted] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
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

  // Check if user has previously allowed audio and set up autoplay
  useEffect(() => {
    const hasAllowedAudio =
      localStorage.getItem("audioPermissionGranted") === "true";
    setHasUserInteracted(hasAllowedAudio);

    if (audioRef.current) {
      audioRef.current.volume = 0.2;

      // Try autoplay if user has previously allowed it
      if (hasAllowedAudio) {
        tryAutoplay();
      } else {
        // Show prompt for first-time users
        setShowAudioPrompt(true);
      }
    }
  }, []);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Try to autoplay audio
  const tryAutoplay = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setShowAudioPrompt(false);
      // Remember that user has allowed audio
      localStorage.setItem("audioPermissionGranted", "true");
    } catch (error) {
      console.log("Autoplay failed, user interaction required");
      setShowAudioPrompt(true);
    }
  };

  // Toggle mute/unmute and play/pause
  const toggleMute = async () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;

      // When unmuting, also play the audio
      if (!newMutedState && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Audio playback error:", err);
        }
      }

      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        localStorage.setItem("audioPermissionGranted", "true");
      }
    }
  };

  // Handle first-time audio permission
  const handleAllowAudio = async () => {
    setHasUserInteracted(true);
    setShowAudioPrompt(false);
    await tryAutoplay();
  };

  // Listen for user interactions to enable autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      if (!isPlaying && audioRef.current && !showAudioPrompt) {
        tryAutoplay();
      }

      // Remove listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
    };

    if (!hasUserInteracted) {
      document.addEventListener("click", handleFirstInteraction);
      document.addEventListener("keydown", handleFirstInteraction);
      document.addEventListener("scroll", handleFirstInteraction);
    }

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
    };
  }, [hasUserInteracted, isPlaying, showAudioPrompt]);

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

      {/* First-time audio permission prompt */}
      {showAudioPrompt && !hasUserInteracted && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Audio Available
            </h3>
            <p className="text-gray-600 mb-4">
              This book has a beautiful soundtrack. Would you like to play it?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleAllowAudio}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Play Audio
              </button>
              <button
                onClick={() => setShowAudioPrompt(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Controls */}
      <div className="fixed top-4 right-4 z-50">
        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-800 hover:bg-opacity-30 rounded-full"
          aria-label={isMuted ? "Unmute soundtrack" : "Mute soundtrack"}
        >
          {isMuted ? (
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4l-5 5H3z" />
              <path
                d="m22.5 12 1.5-1.5-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5L22.5 12z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4l-5 5H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
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
