import toast from "react-hot-toast";
import { type Prompt } from "../data/prompts";

interface PromptDetailViewProps {
  selectedPrompt: Prompt;
  onBack: () => void;
}

export default function PromptDetailView({
  selectedPrompt,
  onBack,
}: PromptDetailViewProps) {
  const handleCopyPrompt = async () => {
    if (selectedPrompt) {
      try {
        await navigator.clipboard.writeText(selectedPrompt.content);
        toast.success("Prompt copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = selectedPrompt.content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        toast.success("Prompt copied to clipboard!");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              {selectedPrompt.title}
            </h3>
            {selectedPrompt.category && (
              <div className="text-sm text-gray-400 mt-1">
                {selectedPrompt.category}
              </div>
            )}
          </div>
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
          <p className="text-gray-300 flex-1">{selectedPrompt.description}</p>

          <div className="flex items-center gap-3 flex-shrink-0">
            {selectedPrompt.gptLink && (
              <a
                href={selectedPrompt.gptLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 h-10"
                title="Open GPT in ChatGPT Store"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Try GPT
              </a>
            )}

            <button
              onClick={handleCopyPrompt}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 h-10"
              title="Copy prompt to clipboard"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Training Embed */}
        {selectedPrompt.videoLink && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Video Training
            </h4>
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
              <iframe
                src={selectedPrompt.videoLink}
                title="Video Training"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-4">
          <pre className="text-gray-100 whitespace-pre-wrap text-sm leading-relaxed">
            {selectedPrompt.content}
          </pre>
        </div>
      </div>

      <p className="text-sm text-gray-400 text-center">
        Your selection has been saved and will be available in future chapters.
      </p>
    </div>
  );
}
