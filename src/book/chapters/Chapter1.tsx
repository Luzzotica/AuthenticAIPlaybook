import { BookChapterProps } from "../types";
import TextChapter from "../templates/TextChapter";

export default function Chapter1(props: BookChapterProps) {
  return (
    <TextChapter
      {...props}
      content={`It was a dark and stormy night. The rain tapped gently on the window, and you felt the weight of the story about to unfold...`}
      backgroundImage="/images/chapter1.jpg"
      backgroundAnimation={null} // e.g., <Rain />
      music="/audio/chapter1.mp3"
      textEffect="typewriter"
    />
  );
}
