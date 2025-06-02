"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollFadeTextProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number; // Percentage of element that needs to be visible to trigger fade-in
  delay?: number; // Delay in milliseconds before fade-in starts
  resetKey?: string | number; // Key to trigger animation reset (e.g., chapter index)
  blockByBlock?: boolean; // Whether to animate individual blocks of text
}

export default function ScrollFadeText({
  children,
  className = "",
  threshold = 0.2,
  delay = 0,
  resetKey,
  blockByBlock = false,
}: ScrollFadeTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState<Set<number>>(new Set());
  const blockObservers = useRef<IntersectionObserver[]>([]);
  const [isInitialLoadPeriod, setIsInitialLoadPeriod] = useState(true);

  // Reset animation when resetKey changes (e.g., when navigating chapters)
  useEffect(() => {
    setIsVisible(false);
    setHasAnimated(false);
    setVisibleBlocks(new Set());
    setIsInitialLoadPeriod(true);

    // End initial load period after 1 second
    const timer = setTimeout(() => {
      setIsInitialLoadPeriod(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resetKey]);

  // Cleanup observers when component unmounts
  useEffect(() => {
    return () => {
      blockObservers.current.forEach((observer) => observer.disconnect());
      blockObservers.current = [];
    };
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Clean up previous observers
    blockObservers.current.forEach((observer) => observer.disconnect());
    blockObservers.current = [];

    if (blockByBlock) {
      // Find all block elements, but avoid nested elements (like code inside pre)
      const blocks = element.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, .prose > div"
      );

      blocks.forEach((block, index) => {
        // Add initial styling for fade-in
        (block as HTMLElement).style.opacity = "0";
        (block as HTMLElement).style.transform = "translateY(20px)";
        (block as HTMLElement).style.transition =
          "opacity 0.4s ease-out, transform 0.4s ease-out";

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                entry.isIntersecting &&
                entry.intersectionRatio >= threshold
              ) {
                // Determine delay: stagger by document order during initial load, immediate during scroll
                const animationDelay = isInitialLoadPeriod
                  ? delay + index * 100
                  : delay;

                setTimeout(() => {
                  setVisibleBlocks((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(index);
                    return newSet;
                  });

                  // Apply fade-in styles
                  (entry.target as HTMLElement).style.opacity = "1";
                  (entry.target as HTMLElement).style.transform =
                    "translateY(0)";
                }, animationDelay);
              }
            });
          },
          {
            threshold: threshold,
            rootMargin: "0px 0px -10% 0px",
          }
        );

        observer.observe(block);
        blockObservers.current.push(observer);
      });
    } else {
      // Original single-element animation logic
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= threshold &&
              !hasAnimated
            ) {
              setTimeout(() => {
                setIsVisible(true);
                setHasAnimated(true);
              }, delay);
            }
          });
        },
        {
          threshold: threshold,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }
  }, [
    threshold,
    delay,
    hasAnimated,
    blockByBlock,
    resetKey,
    isInitialLoadPeriod,
  ]);

  // For block-by-block animation, we don't apply container-level opacity changes
  if (blockByBlock) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  // Original single-element animation
  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
