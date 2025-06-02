import { BookChapterProps } from "../types";
import TextChapter from "../templates/TextChapter";

export default function Chapter1(props: BookChapterProps) {
  return (
    <TextChapter
      {...props}
      content={`Swag swag swag!!`}
      backgroundImage="/images/chapter1.jpg"
      backgroundAnimation={null} // e.g., <Rain />
      music="/audio/chapter1.mp3"
      textEffect="typewriter"
    />
  );
}
