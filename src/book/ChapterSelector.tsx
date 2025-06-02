"use client";

import { useState } from "react";
import { ParsedChapter } from "./utils/chapterLoader";

interface ChapterSelectorProps {
  chapters: ParsedChapter[];
  currentChapterIdx: number;
  onChapterSelect: (index: number) => void;
  getBookVar: (key: string) => any;
}

export default function ChapterSelector({
  chapters,
  currentChapterIdx,
  onChapterSelect,
  getBookVar,
}: ChapterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleChapterSelect = (index: number) => {
    if (isChapterAccessible(index)) {
      onChapterSelect(index);
      setIsOpen(false);
    }
  };

  const getChapterTitle = (chapter: ParsedChapter, index: number) => {
    // Try to get title from metadata, fallback to slug-based title
    if (chapter.title) {
      return chapter.title;
    }

    // Convert slug to readable title
    const slugTitle = chapter.slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return slugTitle;
  };

  // Determine the highest chapter the user has unlocked
  const getMaxAccessibleChapter = () => {
    // Get the furthest chapter the user has reached
    const furthestChapter = getBookVar("furthestChapter") || 0;

    // Check if user can advance from name input chapter
    const nameInputChapterIdx = chapters.findIndex(
      (ch) => ch.slug === "name-input"
    );
    if (nameInputChapterIdx !== -1 && furthestChapter === nameInputChapterIdx) {
      const name = getBookVar("name");
      const email = getBookVar("email");

      // If they haven't completed name/email, they can't go further
      if (!name || name.trim() === "" || !email || email.trim() === "") {
        return nameInputChapterIdx;
      }
    }

    // Allow access to current chapter + 1 (so they can advance)
    return Math.min(furthestChapter + 1, chapters.length - 1);
  };

  const isChapterAccessible = (index: number) => {
    const maxAccessible = getMaxAccessibleChapter();
    return index <= maxAccessible;
  };

  const getChapterStatus = (index: number) => {
    if (index === currentChapterIdx) {
      return "current";
    } else if (index < currentChapterIdx) {
      return "completed";
    } else if (isChapterAccessible(index)) {
      return "accessible";
    } else {
      return "locked";
    }
  };

  const getChapterButtonClass = (index: number) => {
    const status = getChapterStatus(index);
    const baseClass = "w-full text-left p-3 rounded-lg transition-colors";

    switch (status) {
      case "current":
        return `${baseClass} bg-blue-600 text-white`;
      case "completed":
        return `${baseClass} bg-gray-700 text-gray-200 hover:bg-gray-600`;
      case "accessible":
        return `${baseClass} bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700 hover:text-white`;
      case "locked":
        return `${baseClass} bg-gray-900 text-gray-500 cursor-not-allowed opacity-50`;
      default:
        return baseClass;
    }
  };

  const getStatusIcon = (index: number) => {
    const status = getChapterStatus(index);

    switch (status) {
      case "current":
        return <div className="w-2 h-2 bg-white rounded-full" />;
      case "completed":
        return (
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-2 h-2 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "accessible":
        return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
      case "locked":
        return (
          <div className="w-4 h-4 text-gray-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 w-12 h-12 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
        style={{ zIndex: 60 }}
        aria-label="Chapter Menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chapter Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 bg-opacity-95 backdrop-blur-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-20 h-full flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex-shrink-0">
            Chapters
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.slug}
                onClick={() => handleChapterSelect(index)}
                className={getChapterButtonClass(index)}
                disabled={!isChapterAccessible(index)}
                title={
                  !isChapterAccessible(index)
                    ? "Complete previous chapters to unlock"
                    : ""
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {getChapterTitle(chapter, index)}
                    </div>
                    <div className="text-sm opacity-75">
                      Chapter {index + 1}
                    </div>
                  </div>
                  {getStatusIcon(index)}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 flex-shrink-0">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Current Chapter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2 h-2 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-gray-500">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
