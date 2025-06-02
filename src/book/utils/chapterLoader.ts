import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { TextChapterProps, BookChapterProps } from "../types";
import React from "react";

export interface ChapterMetadata {
  title?: string;
  backgroundImage?: string;
  music?: string;
  textEffect?: "typewriter" | "none";
  backgroundAnimation?: string;
}

export interface ParsedChapter extends TextChapterProps {
  title?: string;
  slug: string;
  type: "markdown" | "component";
}

export interface ChapterConfig {
  slug: string;
  type: "markdown" | "component";
  source: string | React.ComponentType<BookChapterProps>; // filename for markdown, component name string or actual component for components
  title?: string;
  // Optional metadata that can override what's in the markdown frontmatter
  metadata?: Partial<ChapterMetadata>;
  // Props to pass to component chapters (only used when type is "component")
  componentProps?: Record<string, any>;
}

// Import example components for direct reference
// import CustomizableChapter from "../chapters/CustomizableChapter";

// Chapter configuration - define your chapters here
export const CHAPTER_CONFIGS: ChapterConfig[] = [
  {
    slug: "name-input",
    type: "component",
    source: "NameInputChapter",
    title: "Welcome, Traveler",
  },
  {
    slug: "chapter-01",
    type: "markdown",
    source: "chapter-01.md",
  },
  {
    slug: "chapter-02",
    type: "markdown",
    source: "chapter-02.md",
  },
  {
    slug: "chapter-03",
    type: "markdown",
    source: "chapter-03.md",
  },
  {
    slug: "chapter-04",
    type: "markdown",
    source: "chapter-04.md",
  },
  {
    slug: "chapter-05",
    type: "markdown",
    source: "chapter-05.md",
  },
  {
    slug: "chapter-06",
    type: "markdown",
    source: "chapter-06.md",
  },
  {
    slug: "chapter-07",
    type: "markdown",
    source: "chapter-07.md",
  },
  {
    slug: "chapter-08",
    type: "markdown",
    source: "chapter-08.md",
  },
  {
    slug: "chapter-09",
    type: "markdown",
    source: "chapter-09.md",
  },
  {
    slug: "chapter-10",
    type: "markdown",
    source: "chapter-10.md",
  },
  {
    slug: "chapter-11",
    type: "component",
    source: "ExampleInteractiveChapter",
    title: "The Prompt Library",
    metadata: {
      backgroundImage: "/images/crossroads.jpg",
    },
  },
];

export async function loadMarkdownChapter(
  filename: string
): Promise<Omit<ParsedChapter, "slug" | "type">> {
  try {
    const response = await fetch(`/chapters/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load markdown chapter: ${filename}`);
    }

    const markdownContent = await response.text();
    const { data, content } = matter(markdownContent);

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html, { allowDangerousHtml: true })
      .process(content);

    const htmlContent = processedContent.toString();

    return {
      content: htmlContent,
      backgroundImage: data.backgroundImage,
      backgroundVideo: data.backgroundVideo,
      textEffect: data.textEffect as "typewriter" | "none" | undefined,
      backgroundAnimation: data.backgroundAnimation,
      title: data.title,
    };
  } catch (error) {
    console.error(`Error loading markdown chapter ${filename}:`, error);
    throw error;
  }
}

export async function loadComponentChapter(
  componentSource: string | React.ComponentType<BookChapterProps>,
  componentProps?: Record<string, any>
): Promise<Omit<ParsedChapter, "slug" | "type">> {
  try {
    let Component: React.ComponentType<BookChapterProps>;

    if (typeof componentSource === "string") {
      // Dynamic import of the component by name
      const componentModule = await import(`../chapters/${componentSource}`);
      Component = componentModule.default;
    } else {
      // Use the component directly
      Component = componentSource;
    }

    // Create a wrapper component that merges BookChapterProps with custom props
    const WrappedComponent = (bookProps: BookChapterProps) => {
      return React.createElement(Component, {
        ...bookProps,
        ...componentProps,
      });
    };

    // Return the wrapped component as content
    return {
      content: React.createElement(WrappedComponent),
      // Component chapters will get their metadata from the config
    };
  } catch (error) {
    console.error(`Error loading component chapter:`, error);
    throw error;
  }
}

export async function loadChapter(
  config: ChapterConfig
): Promise<ParsedChapter> {
  try {
    let chapterData: Omit<ParsedChapter, "slug" | "type">;

    if (config.type === "markdown") {
      chapterData = await loadMarkdownChapter(config.source as string);
    } else {
      chapterData = await loadComponentChapter(
        config.source,
        config.componentProps
      );
    }

    // Merge config metadata with loaded data (config takes precedence)
    const mergedData: ParsedChapter = {
      ...chapterData,
      ...config.metadata,
      title: config.title || chapterData.title,
      slug: config.slug,
      type: config.type,
    };

    return mergedData;
  } catch (error) {
    console.error(`Error loading chapter ${config.slug}:`, error);
    throw error;
  }
}

export async function loadAllChapters(): Promise<ParsedChapter[]> {
  try {
    const chapters = await Promise.all(
      CHAPTER_CONFIGS.map((config) => loadChapter(config))
    );
    return chapters;
  } catch (error) {
    console.error("Error loading chapters:", error);
    // Return empty array or default chapters as fallback
    return [];
  }
}
