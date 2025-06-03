import BookPage from "./BookPage";
import ScrollFadeText from "../effects/ScrollFadeText";
import { BookChapterProps, TextChapterProps } from "../types";
import React from "react";
import {
  replaceBookVariables,
  replaceBookVariablesInHTML,
} from "../utils/textReplacer";

// Function to add target="_blank" to all anchor tags
function addTargetBlankToLinks(html: string): string {
  return html.replace(/<a /g, '<a target="_blank" ');
}

export default function TextChapter({
  content,
  backgroundImage,
  backgroundVideo,
  backgroundAnimation,
  textEffect,
  nextChapter,
  prevChapter,
  setBookVar,
  getBookVar,
  clearAllVars,
  chapterIndex,
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

        // Add target="_blank" to all anchor tags
        const processedHTMLWithTargetBlank =
          addTargetBlankToLinks(processedHTML);

        // Render HTML content from markdown with block-by-block scroll fade-in
        return (
          <ScrollFadeText resetKey={chapterIndex} blockByBlock={true}>
            <div
              className="prose prose-lg max-w-none text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-a:text-blue-300 prose-a:hover:text-blue-200 prose-a:underline prose-ol:text-white prose-li:text-white marker:text-white"
              dangerouslySetInnerHTML={{ __html: processedHTMLWithTargetBlank }}
            />
          </ScrollFadeText>
        );
      }

      // Replace variables in plain text content
      const processedText = replaceBookVariables(content, getBookVar);

      // Use scroll fade-in with reset key for navigation
      return (
        <ScrollFadeText resetKey={chapterIndex}>
          <p className="text-lg leading-relaxed">{processedText}</p>
        </ScrollFadeText>
      );
    }

    // Wrap other React nodes in scroll fade-in with reset key
    return <ScrollFadeText resetKey={chapterIndex}>{content}</ScrollFadeText>;
  };

  return (
    <BookPage
      backgroundImage={backgroundImage}
      backgroundVideo={backgroundVideo}
      backgroundAnimation={backgroundAnimation}
      resetKey={chapterIndex}
    >
      <div className="space-y-8">{renderContent()}</div>
    </BookPage>
  );
}
