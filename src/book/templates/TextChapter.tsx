import BookPage from "./BookPage";
import Typewriter from "../effects/Typewriter";
import { BookChapterProps, TextChapterProps } from "../types";
import React from "react";
import {
  replaceBookVariables,
  replaceBookVariablesInHTML,
} from "../utils/textReplacer";

export default function TextChapter({
  content,
  backgroundImage,
  backgroundAnimation,
  textEffect,
  nextChapter,
  prevChapter,
  setBookVar,
  getBookVar,
  clearAllVars,
}: TextChapterProps & BookChapterProps) {
  const renderContent = () => {
    // If content is a React element (component chapter)
    if (React.isValidElement(content)) {
      // Clone the element and pass the book props to it
      return React.cloneElement(
        content as React.ReactElement<BookChapterProps>,
        {
          nextChapter,
          prevChapter,
          setBookVar,
          getBookVar,
          clearAllVars,
        }
      );
    }

    if (typeof content === "string") {
      // Check if content contains HTML tags (from markdown conversion)
      const isHTML = content.includes("<") && content.includes(">");

      if (isHTML) {
        // Replace variables in HTML content
        const processedHTML = replaceBookVariablesInHTML(content, getBookVar);

        // Render HTML content from markdown
        return (
          <div
            className="prose prose-lg max-w-none text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-a:text-blue-300 prose-a:hover:text-blue-200 prose-a:underline"
            dangerouslySetInnerHTML={{ __html: processedHTML }}
          />
        );
      }

      // Replace variables in plain text content
      const processedText = replaceBookVariables(content, getBookVar);

      // Handle plain text with effects
      if (textEffect === "typewriter") {
        return <Typewriter>{processedText}</Typewriter>;
      }
      return <p className="text-lg leading-relaxed">{processedText}</p>;
    }

    // Fallback for other React nodes
    return content;
  };

  return (
    <BookPage
      backgroundImage={backgroundImage}
      backgroundAnimation={backgroundAnimation}
    >
      <div className="space-y-4">{renderContent()}</div>
    </BookPage>
  );
}
