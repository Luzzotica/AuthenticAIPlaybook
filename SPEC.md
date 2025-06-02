# Echoes of Me: Immersive Book System Spec

## Overview

"Echoes of Me" is now an immersive, interactive book experience. The app presents a linear sequence of chapters, each designed to be visually and auditorily engaging, with support for scrollable and animated text, parallax backgrounds, background animations (like rain, fog, or snow), and music or sound effects. Chapters are implemented as React components, allowing for rich, dynamic content and interactivity.

## Core Features

- **Linear Book Structure:**
  - The book is a sequence of chapters, each a React component following a standard interface.
  - Navigation is linear: users can move forward and backward between chapters.

- **Chapter Content:**
  - Each chapter can display scrollable text, with support for animated effects (e.g., typewriter effect).
  - Chapters can include links or interactive elements within the text.
  - Chapters can define their own background image, background animation, and music/sound effects.

- **Visual & Audio Immersion:**
  - **Background Image:** Each chapter can specify a background image, which is rendered with vertical parallax scrolling.
  - **Background Animation:** Chapters can add animated effects (e.g., rain, fog, snow) as React components.
  - **Music/Sound Effects:** Chapters can play background music or sound effects, which loop and are unique per chapter.

- **Book Variables:**
  - Global, dynamic variables can be set and read from any chapter using provided functions (`setBookVar`, `getBookVar`).
  - Book variables persist across sessions (using localStorage).
  - Chapters can react to variable changes if needed.

- **Minimal UI:**
  - The interface is focused on immersion: no persistent navigation or overlays, just the chapter content, background, and effects.

## Technical Architecture

- **Chapters:**
  - Each chapter is a React component that receives navigation and book variable functions as props.
  - Chapters can use a `BaseChapter` component to easily specify content, background, animation, and music.

- **BookPage:**
  - Handles rendering the background image (with parallax), background animation, music, and scrollable content area.

- **Book Variables:**
  - Managed via a Zustand store, persisted to localStorage.
  - API: `setBookVar(key, value)`, `getBookVar(key)`.

- **Text Effects:**
  - Typewriter effect is available for animated text.
  - Additional effects can be added as needed.

## Example Chapter Usage

```tsx
<BaseChapter
  content="It was a dark and stormy night..."
  backgroundImage="/images/chapter1.jpg"
  backgroundAnimation={<Rain />}
  music="/audio/chapter1.mp3"
  textEffect="typewriter"
  nextChapter={...}
  prevChapter={...}
  setBookVar={...}
  getBookVar={...}
/>
```

## Extensibility

- New chapters can be added as new React components.
- New background animations can be created as React components and passed to chapters.
- The system is designed for easy expansion and customization.

---

This spec supersedes the previous visual novel/game structure. The focus is now on immersive, scrollable, and animated book chapters with rich media and persistent global state.