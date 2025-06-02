import { useState } from "react";
import { BookChapterProps } from "../types";
import { prompts, colorClasses, type Prompt } from "../data/prompts";
import PromptDetailView from "./PromptDetailView";

interface ExampleInteractiveChapterProps extends BookChapterProps {}

export default function ExampleInteractiveChapter({
  nextChapter,
  prevChapter,
  setBookVar,
  getBookVar,
}: ExampleInteractiveChapterProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    // Store the selected prompt in book variables for later use
    setBookVar("selectedPrompt", prompt.id);
  };

  const handleBack = () => {
    setSelectedPrompt(null);
  };

  const getButtonColorClass = (color?: string) => {
    if (color && color in colorClasses) {
      return colorClasses[color as keyof typeof colorClasses];
    }
    return colorClasses.blue; // Default color
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-6">
          AI Prompt Library
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          {getBookVar("name")}, each of these prompts is designed following the{" "}
          <strong>Authentic AI Voice System** + a powerful framework</strong>{" "}
          from an expert in the field.
        </p>
        <p className="text-lg text-gray-300 mb-8">
          <strong>
            Alex Hormozi, Russel Brunson, and Nicolas Cole to name a few.
          </strong>
        </p>
      </div>

      {!selectedPrompt ? (
        <>
          {/* Break out of parent container for full width */}
          <div className="relative -mx-4 md:-mx-[calc((100vw-80vw)/2)] lg:-mx-[calc((100vw-1200px)/2)]">
            <div className="px-4 md:px-8 lg:px-12">
              {/* Prompts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {prompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handlePromptSelect(prompt)}
                    className={`p-8 ${getButtonColorClass(
                      prompt.color
                    )} rounded-lg text-white transition-all duration-300 ease-out text-left hover:scale-105 transform min-h-[200px] flex flex-col justify-between hover:shadow-2xl`}
                  >
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">
                        {prompt.title}
                      </h3>
                      <p className="text-base opacity-90 mb-4 leading-relaxed">
                        {prompt.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="text-sm opacity-60">Click to view →</div>
                    </div>
                  </button>
                ))}
              </div>

              {prompts.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No prompts found in this category.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <PromptDetailView selectedPrompt={selectedPrompt} onBack={handleBack} />
      )}
    </div>
  );
}
