import { BookChapterProps } from "../types";

interface CustomizableChapterProps extends BookChapterProps {
  title?: string;
  message?: string;
  difficulty?: "easy" | "medium" | "hard";
  theme?: "light" | "dark";
  showChoices?: boolean;
  choices?: string[];
}

export default function CustomizableChapter({
  nextChapter,
  prevChapter,
  setBookVar,
  getBookVar,
  title = "Customizable Chapter",
  message = "This is a customizable chapter!",
  difficulty = "medium",
  theme = "dark",
  showChoices = false,
  choices = ["Option 1", "Option 2", "Option 3"],
}: CustomizableChapterProps) {
  const themeClasses = {
    light: "bg-white text-black",
    dark: "bg-gray-800 text-white",
  };

  const difficultyColors = {
    easy: "text-green-400",
    medium: "text-yellow-400",
    hard: "text-red-400",
  };

  const handleChoice = (choice: string) => {
    setBookVar("lastCustomChoice", choice);
    nextChapter();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <div className={`p-4 rounded-lg ${themeClasses[theme]}`}>
          <p className="text-lg mb-4">{message}</p>
          <p className={`text-sm ${difficultyColors[difficulty]}`}>
            Difficulty: {difficulty.toUpperCase()}
          </p>
        </div>
      </div>

      {showChoices && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">
            Choose your path:
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {!showChoices && (
        <div className="text-center">
          <button
            onClick={nextChapter}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Previous choice: {getBookVar("lastCustomChoice") || "None"}
        </p>
      </div>
    </div>
  );
}
