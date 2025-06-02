import { useState, useEffect } from "react";
import { BookChapterProps } from "../types";

interface NameInputChapterProps extends BookChapterProps {}

export default function NameInputChapter({
  nextChapter,
  prevChapter,
  setBookVar,
  getBookVar,
  clearAllVars,
}: NameInputChapterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if name and email are already stored
  useEffect(() => {
    const storedName = getBookVar("name");
    const storedEmail = getBookVar("email");
    if (storedName && storedEmail) {
      setName(storedName);
      setEmail(storedEmail);
      setHasSubmitted(true);
    }
  }, [getBookVar]);

  const sendToWebhook = async (name: string, email: string) => {
    try {
      const response = await fetch(
        "https://hook.us1.make.com/iv3wghaan4y24retqm7sk90pbwoty207",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: name,
            source: "authentic ai voice playbook",
          }),
        }
      );
      console.log("Webhook response:", response);

      if (!response.ok) {
        console.error(
          "Webhook request failed:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error sending to webhook:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setIsSubmitting(true);

      // Store the data
      setBookVar("name", name.trim());
      setBookVar("email", email.trim());

      // Send to webhook
      await sendToWebhook(name.trim(), email.trim());

      setHasSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Clear the submitted state if they start typing again
    if (
      hasSubmitted &&
      (e.target.value.trim() !== getBookVar("name") ||
        email.trim() !== getBookVar("email"))
    ) {
      setHasSubmitted(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear the submitted state if they start typing again
    if (
      hasSubmitted &&
      (name.trim() !== getBookVar("name") ||
        e.target.value.trim() !== getBookVar("email"))
    ) {
      setHasSubmitted(false);
    }
  };

  const isFormValid = name.trim() && email.trim() && email.includes("@");

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome to the Authentic AI Voice Playbook
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          You're about to discover the system that transformed AI from a robotic
          tool into my personal ghostwriter—one that allowed me to write entire
          books in my authentic style (and close over $200K in business in 6
          months).
        </p>
        <p>
          Before we begin this journey together, I need to know who you are.
        </p>
      </div>

      {!hasSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              What's your name?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your first name..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              What's your email address?
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-400 mt-1">
              I'll use this to send you additional resources and updates about
              the Authentic AI Voice system.
            </p>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isFormValid && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting
              ? "Starting Your Journey..."
              : "Begin My AI Voice Journey"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="bg-green-800 bg-opacity-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Welcome to the journey, {getBookVar("name")}!
            </h3>
            <p className="text-gray-300">
              You're now part of an exclusive group learning the Authentic AI
              Voice system. Throughout this playbook, you'll discover how to
              train AI to write exactly like you—capturing your stories, your
              rhythm, and your unique perspective.
            </p>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Get ready to transform how you work with AI forever. Let's dive into
            your story...
          </p>

          <button
            onClick={nextChapter}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
          >
            Start Chapter 1
          </button>

          <div className="mt-4">
            <button
              onClick={() => {
                setHasSubmitted(false);
                setName("");
                setEmail("");
                clearAllVars();
              }}
              className="text-gray-400 hover:text-white text-sm underline"
            >
              Update Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
