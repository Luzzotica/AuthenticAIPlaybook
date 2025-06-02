"use client";

import ScrollVideoBackground from "../effects/ScrollVideoBackground";
import { useEffect, useState } from "react";

interface BookPageProps {
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundAnimation?: React.ReactNode;
  children: React.ReactNode;
  resetKey?: string | number; // Key to trigger background transitions (e.g., chapter index)
}

export default function BookPage({
  backgroundImage,
  backgroundVideo,
  backgroundAnimation,
  children,
  resetKey,
}: BookPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayBackground, setDisplayBackground] = useState({
    image: backgroundImage,
    video: backgroundVideo,
    animation: backgroundAnimation,
  });

  // Handle background transitions when resetKey changes (navigation)
  useEffect(() => {
    if (resetKey !== undefined) {
      // Fade out current background
      setIsVisible(false);

      // After fade out, update background and fade in
      const timer = setTimeout(() => {
        setDisplayBackground({
          image: backgroundImage,
          video: backgroundVideo,
          animation: backgroundAnimation,
        });
        setIsVisible(true);
      }, 300); // Match transition duration

      return () => clearTimeout(timer);
    }
  }, [resetKey, backgroundImage, backgroundVideo, backgroundAnimation]);

  // Initialize visibility on first load
  useEffect(() => {
    if (resetKey === undefined) {
      setIsVisible(true);
      setDisplayBackground({
        image: backgroundImage,
        video: backgroundVideo,
        animation: backgroundAnimation,
      });
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* Video Background */}
      {displayBackground.video && (
        <div
          className={`fixed inset-0 w-screen h-screen -z-10 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <ScrollVideoBackground
            videoSrc={displayBackground.video}
            className=""
          />
        </div>
      )}

      {/* Parallax Background Image (fallback if no video) */}
      {!displayBackground.video && displayBackground.image && (
        <div
          className={`fixed inset-0 w-screen h-screen bg-cover bg-center -z-10 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${displayBackground.image})`,
          }}
        />
      )}

      {/* Background Animation */}
      {displayBackground.animation && (
        <div
          className={`fixed inset-0 w-screen h-screen pointer-events-none -z-10 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {displayBackground.animation}
        </div>
      )}

      {/* Black Overlay for text readability */}
      <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-60 -z-5" />

      {/* Scrollable Text Area */}
      <div className="relative z-10 max-w-2xl mx-auto py-16 px-4 min-h-screen">
        {children}
      </div>
    </div>
  );
}
