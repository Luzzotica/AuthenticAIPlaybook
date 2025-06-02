# Chapter System

This directory contains React component chapters for the book. The book supports two types of chapters:

## 1. Markdown Chapters
- Stored in `public/chapters/` as `.md` files
- Support frontmatter metadata (title, backgroundImage, music, textEffect)
- Automatically converted to HTML and styled with Tailwind prose classes
- Great for narrative content, simple text chapters

### Example markdown chapter:
```markdown
---
title: "Chapter 1: The Beginning"
backgroundImage: "/images/chapter1.jpg"
music: "/audio/chapter1.mp3"
textEffect: "typewriter"
---

# Chapter 1: The Beginning

Your story begins here...
```

## 2. Component Chapters
- Stored in this directory (`src/book/chapters/`) as `.tsx` files
- Full React components with interactive capabilities
- Access to book state via `setBookVar` and `getBookVar`
- Support for custom props passed from configuration
- Perfect for interactive content, choices, mini-games, etc.

### Example component chapter:
```tsx
import { BookChapterProps } from "../types";

interface MyChapterProps extends BookChapterProps {
  customMessage?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export default function MyChapter({ 
  nextChapter, 
  prevChapter, 
  setBookVar, 
  getBookVar,
  customMessage = "Default message",
  difficulty = "medium"
}: MyChapterProps) {
  return (
    <div>
      <h1>Interactive Chapter</h1>
      <p>{customMessage}</p>
      <p>Difficulty: {difficulty}</p>
      {/* Your interactive content here */}
    </div>
  );
}
```

## Configuration

Chapters are configured in `src/book/utils/chapterLoader.ts` in the `CHAPTER_CONFIGS` array:

### Basic Configuration:
```typescript
export const CHAPTER_CONFIGS: ChapterConfig[] = [
  {
    slug: "chapter-01",
    type: "markdown",
    source: "chapter-01.md", // file in public/chapters/
    title: "Chapter 1: A Dark Beginning"
  },
  {
    slug: "interactive-chapter",
    type: "component", 
    source: "ExampleInteractiveChapter", // component name (without .tsx)
    title: "Interactive Chapter",
    metadata: {
      backgroundImage: "/images/interactive.jpg",
      music: "/audio/interactive.mp3"
    }
  }
];
```

### Advanced Configuration with Props:

You can pass custom props to component chapters in two ways:

#### 1. Using Component Name (String Reference):
```typescript
{
  slug: "customizable-chapter",
  type: "component",
  source: "CustomizableChapter", // component name as string
  title: "Customizable Chapter",
  metadata: {
    backgroundImage: "/images/custom.jpg",
  },
  componentProps: {
    customMessage: "Welcome to this customized experience!",
    difficulty: "hard",
    theme: "dark",
    showChoices: true,
    choices: ["Option A", "Option B", "Option C"]
  }
}
```

#### 2. Using Direct Component Reference:
```typescript
// First import the component at the top of chapterLoader.ts
import CustomizableChapter from "../chapters/CustomizableChapter";

// Then use it directly in the config
{
  slug: "direct-component",
  type: "component",
  source: CustomizableChapter, // direct component reference
  title: "Direct Component Chapter",
  metadata: {
    backgroundImage: "/images/direct.jpg",
  },
  componentProps: {
    customMessage: "This uses a direct component reference!",
    difficulty: "easy",
    theme: "light"
  }
}
```

## Adding New Chapters

1. **For Markdown Chapters:**
   - Create a new `.md` file in `public/chapters/`
   - Add configuration to `CHAPTER_CONFIGS`

2. **For Component Chapters:**
   - Create a new `.tsx` file in `src/book/chapters/`
   - Export a default component that accepts `BookChapterProps` (and optionally extends it with custom props)
   - Add configuration to `CHAPTER_CONFIGS`
   - Optionally specify `componentProps` to pass custom data to your component

## Book State Management

Component chapters can interact with the book's state:
- `setBookVar(key, value)` - Store data that persists across chapters
- `getBookVar(key)` - Retrieve stored data
- `nextChapter()` - Navigate to next chapter
- `prevChapter()` - Navigate to previous chapter

## Component Props

When creating component chapters that accept custom props:

1. **Extend BookChapterProps**: Your component's props interface should extend `BookChapterProps`
2. **Provide defaults**: Use default parameter values for optional custom props
3. **Type safety**: Define your custom props with proper TypeScript types
4. **Merge props**: The system automatically merges `BookChapterProps` with your `componentProps`

### Example with Custom Props:
```tsx
interface CustomChapterProps extends BookChapterProps {
  title?: string;
  message?: string;
  difficulty?: "easy" | "medium" | "hard";
  showChoices?: boolean;
  choices?: string[];
}

export default function CustomChapter({
  nextChapter,
  prevChapter,
  setBookVar,
  getBookVar,
  title = "Default Title",
  message = "Default message",
  difficulty = "medium",
  showChoices = false,
  choices = [],
}: CustomChapterProps) {
  // Your component logic here
}
``` 