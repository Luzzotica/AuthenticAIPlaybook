"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollVideoBackgroundProps {
  videoSrc: string;
  className?: string;
}

export default function ScrollVideoBackground({
  videoSrc,
  className = "",
}: ScrollVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Set initial video time to 0
      video.currentTime = 0;
    };

    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const video = videoRef.current;
    if (!video) return;

    const updateVideoTime = () => {
      // Calculate scroll progress based on total document height
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = documentHeight - viewportHeight;

      // Calculate scroll progress as a percentage of total scrollable area
      const scrollProgress =
        maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0;

      // Map scroll progress to video duration
      const videoDuration = video.duration;
      if (videoDuration && videoDuration > 0) {
        const targetTime = scrollProgress * videoDuration;

        // Only update if the difference is significant to avoid jitter
        if (Math.abs(video.currentTime - targetTime) > 0.1) {
          video.currentTime = targetTime;
        }
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateVideoTime);
        ticking.current = true;
      }
      lastScrollY.current = window.scrollY;
    };

    // Initial update
    updateVideoTime();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateVideoTime);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateVideoTime);
    };
  }, [isLoaded]);

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSrc}
        muted
        playsInline
        preload="metadata"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      {/* {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )} */}
    </div>
  );
}
