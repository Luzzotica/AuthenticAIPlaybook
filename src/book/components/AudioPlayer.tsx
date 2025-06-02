"use client";

import { useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
  playlist?: string[];
}

export default function AudioPlayer({
  playlist = [
    "/audio/book-soundtrack.mp3",
    "/audio/book-soundtrack-2.mp3",
    "/audio/book-soundtrack-3.mp3",
  ],
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [isMuted, setIsMuted] = useState(() => {
    // Initialize mute state based on audio permission
    const hasAllowedAudio =
      localStorage.getItem("audioPermissionGranted") === "true";
    return !hasAllowedAudio; // Muted if they haven't allowed audio
  });
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [pendingPlay, setPendingPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if user has previously seen the audio prompt
  useEffect(() => {
    const hasAllowedAudio =
      localStorage.getItem("audioPermissionGranted") === "true";
    const hasSeenPrompt = localStorage.getItem("audioPromptSeen") === "true";

    console.log("hasAllowedAudio", hasAllowedAudio);
    console.log("hasSeenPrompt", hasSeenPrompt);

    setHasUserInteracted(hasAllowedAudio);

    // Only show prompt if user hasn't seen it before
    if (!hasSeenPrompt) {
      setShowAudioPrompt(true);
    }
  }, []);

  // Handle audio element setup (no autoplay)
  useEffect(() => {
    console.log("Audio element check:", audioRef.current);
    if (audioRef.current) {
      audioRef.current.volume = 0.2;

      // Set initial source if not set
      if (!audioRef.current.src && playlist[currentSongIndex]) {
        audioRef.current.src = playlist[currentSongIndex];
      }

      // Never autoplay on load - user must manually start
    }
  }, []);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Update audio source when current song index changes
  useEffect(() => {
    console.log("currentSongIndex", currentSongIndex);
    if (audioRef.current && playlist[currentSongIndex]) {
      const newSrc = playlist[currentSongIndex];
      const currentSrc = audioRef.current.src;

      // Only change source if it's actually different (compare the actual URLs)
      if (!currentSrc.endsWith(newSrc)) {
        console.log("setting new src", newSrc);
        audioRef.current.src = newSrc;
      }
    }
  }, [currentSongIndex]);

  // Handle when audio is ready to play
  const handleCanPlay = async () => {
    console.log("handleCanPlay");
    console.log("pendingPlay", pendingPlay);
    console.log("audioRef.current", audioRef.current);
    console.log("hasUserInteracted", hasUserInteracted);
    if (pendingPlay && audioRef.current && hasUserInteracted) {
      setPendingPlay(false);
      try {
        await audioRef.current.play();
      } catch (err) {
        console.log("Failed to play audio after loading:", err);
      }
    }
  };

  // Function to go to next song in playlist
  const nextSong = async () => {
    console.log("nextSong");
    if (!audioRef.current) return;

    console.log("audioRef.current", audioRef.current);
    console.log("wasPlaying", isPlaying);
    console.log("hasUserInteracted", hasUserInteracted);
    const newIndex = (currentSongIndex + 1) % playlist.length;

    // Update the source directly
    audioRef.current.src = playlist[newIndex];
    setCurrentSongIndex(newIndex);

    // Clicking next/prev means user wants to hear music - unmute and enable
    setIsMuted(false);
    audioRef.current.muted = false;
    setHasUserInteracted(true);
    localStorage.setItem("audioPermissionGranted", "true");
    console.log("Next song clicked - unmuted and enabled audio");

    // Always start playing when manually skipping
    console.log("setting pending play");
    setPendingPlay(true);
  };

  // Function to go to previous song in playlist
  const prevSong = async () => {
    if (!audioRef.current) return;

    const newIndex =
      currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;

    // Update the source directly
    audioRef.current.src = playlist[newIndex];
    setCurrentSongIndex(newIndex);

    // Clicking next/prev means user wants to hear music - unmute and enable
    setIsMuted(false);
    audioRef.current.muted = false;
    setHasUserInteracted(true);
    localStorage.setItem("audioPermissionGranted", "true");
    console.log("Previous song clicked - unmuted and enabled audio");

    // Always start playing when manually skipping
    setPendingPlay(true);
  };

  // Try to autoplay audio
  const tryAutoplay = async () => {
    if (!audioRef.current || isPlaying) return;

    console.log("Attempting autoplay...");
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setShowAudioPrompt(false);
      // Remember that user has allowed audio
      localStorage.setItem("audioPermissionGranted", "true");
      console.log("Autoplay successful");
    } catch (error) {
      console.log("Autoplay failed, user interaction required:", error);
      setShowAudioPrompt(true);
    }
  };

  // Toggle mute/unmute and play/pause
  const toggleMute = async () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;

      // Update permission based on mute state
      if (newMutedState) {
        // When muting, disable auto-start for future sessions
        localStorage.setItem("audioPermissionGranted", "false");
        setHasUserInteracted(false);
        console.log("Music muted - disabled auto-start for future sessions");
      } else {
        // When unmuting, enable auto-start for future sessions
        localStorage.setItem("audioPermissionGranted", "true");
        setHasUserInteracted(true);
        console.log("Music unmuted - enabled auto-start for future sessions");

        // When unmuting, also play the audio
        if (!isPlaying) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (err) {
            console.log("Audio playback error:", err);
          }
        }
      }
    }
  };

  // Handle song end - automatically go to next song
  const handleSongEnd = () => {
    console.log(`Song ${currentSongIndex + 1} ended, moving to next song`);
    nextSong();
  };

  // Handle audio error - try next song
  const handleAudioError = () => {
    console.log(
      `Audio error with song ${currentSongIndex + 1}, trying next song`
    );
    nextSong();
  };

  // Handle first-time audio permission
  const handleAllowAudio = async () => {
    setHasUserInteracted(true);
    setShowAudioPrompt(false);
    localStorage.setItem("audioPermissionGranted", "true");
    localStorage.setItem("audioPromptSeen", "true");
    // Don't autoplay - let user manually start music
  };

  // Handle declining audio
  const handleSkipAudio = () => {
    setShowAudioPrompt(false);
    localStorage.setItem("audioPromptSeen", "true");
    // User has seen the prompt but declined
  };

  // Listen for user interactions to enable autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      // If user has previously allowed audio, start playing on first interaction
      if (hasUserInteracted && audioRef.current && !isPlaying) {
        console.log(
          "First interaction detected, starting music for returning user"
        );
        tryAutoplay();
      }

      // Always mark that user has interacted (for new users)
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }

      // Remove listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
    };

    // Only add listeners if we haven't had interaction yet, or if user previously allowed audio
    if (!hasUserInteracted || (hasUserInteracted && !isPlaying)) {
      document.addEventListener("click", handleFirstInteraction);
      document.addEventListener("keydown", handleFirstInteraction);
      document.addEventListener("scroll", handleFirstInteraction);
    }

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
    };
  }, [hasUserInteracted, isPlaying, showAudioPrompt]);

  return (
    <>
      {/* Audio element with playlist support */}
      <audio
        ref={audioRef}
        src={playlist[currentSongIndex]}
        preload="auto"
        onEnded={handleSongEnd}
        onError={handleAudioError}
        onCanPlay={handleCanPlay}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        style={{ display: "none" }}
      />

      {/* First-time audio permission prompt */}
      {showAudioPrompt && !hasUserInteracted && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Audio Available
            </h3>
            <p className="text-gray-600 mb-4">
              This book has a beautiful soundtrack. Would you like to play it?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleAllowAudio}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Play Audio
              </button>
              <button
                onClick={handleSkipAudio}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Controls */}
      <div className="fixed top-4 right-4 z-50">
        {/* Combined Audio Controls */}
        <div className="flex gap-1 bg-gray-800 bg-opacity-50 rounded-lg p-1">
          <button
            onClick={prevSong}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-700 hover:bg-opacity-50 rounded"
            aria-label="Previous song"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <span className="px-2 py-1 text-white text-xs flex items-center">
            {currentSongIndex + 1}/{playlist.length}
          </span>

          <button
            onClick={nextSong}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-700 hover:bg-opacity-50 rounded"
            aria-label="Next song"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          {/* Separator */}
          <div className="w-px bg-gray-600 mx-1"></div>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-700 hover:bg-opacity-50 rounded"
            aria-label={isMuted ? "Unmute soundtrack" : "Mute soundtrack"}
          >
            {isMuted ? (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4l-5 5H3z" />
                <path
                  d="m22.5 12 1.5-1.5-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5L22.5 12z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4l-5 5H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
