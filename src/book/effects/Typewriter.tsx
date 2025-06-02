"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  children: string;
  speed?: number; // ms per character
}

export default function Typewriter({ children, speed = 20 }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < children.length) {
        setDisplayed((prev) => prev + children[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [children, speed]);

  return <span>{displayed}</span>;
}
