"use client";

interface BookNavigationProps {
  nextChapter: () => void;
  prevChapter: () => void;
  isFirst: boolean;
  isLast: boolean;
  isNextDisabled?: boolean;
}

export default function BookNavigation({
  nextChapter,
  prevChapter,
  isFirst,
  isLast,
  isNextDisabled = false,
}: BookNavigationProps) {
  const isNextButtonDisabled = isLast || isNextDisabled;

  return (
    <div
      className="fixed left-0 right-0 flex justify-center items-center z-40"
      style={{ bottom: 40 }}
    >
      <div className="flex space-x-10 pointer-events-auto">
        {!isFirst && (
          <button
            onClick={prevChapter}
            className="w-16 h-16 flex items-center justify-center rounded-full shadow-lg transition focus:outline-none bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            aria-label="Previous Chapter"
            style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 8L12 16L20 24"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {!isNextButtonDisabled && (
          <button
            onClick={nextChapter}
            className="w-16 h-16 flex items-center justify-center rounded-full shadow-lg transition focus:outline-none bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            aria-label="Next Chapter"
            style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8L20 16L12 24"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
