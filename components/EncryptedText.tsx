"use client";

// Scramble/decrypt text effect — characters cycle through random glyphs
// before settling to the real value, left to right.
// Drop-in replacement for the @aceternity/encrypted-text component pattern.

import { useEffect, useState, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

interface Props {
  text: string;
  className?: string;
  /** ms between frames (lower = faster scramble). Default 35 */
  speed?: number;
  /** Delay before animation starts in ms. Default 0 */
  delay?: number;
}

export default function EncryptedText({
  text,
  className,
  speed = 35,
  delay = 0,
}: Props) {
  // Start with the real text so SSR and initial hydration match,
  // then let the effect scramble + resolve it.
  const [output, setOutput] = useState<string[]>(() => text.split(""));
  const frameRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const chars = text.split("");
    // How many frames until each character "locks"
    const lockAt = chars.map((_, i) => i * 2 + 3); // stagger lock per char
    const maxFrames = lockAt[lockAt.length - 1] + 1;

    const start = () => {
      frameRef.current = 0;
      timerRef.current = setInterval(() => {
        frameRef.current++;
        const f = frameRef.current;

        setOutput(
          chars.map((c, i) => {
            if (!/[a-zA-Z0-9]/.test(c)) return c; // preserve spaces / symbols
            if (f >= lockAt[i]) return c;          // character has settled
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
        );

        if (f >= maxFrames) {
          clearInterval(timerRef.current!);
        }
      }, speed);
    };

    if (delay > 0) {
      delayRef.current = setTimeout(start, delay);
    } else {
      start();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, [text, speed, delay]);

  return <span className={className}>{output.join("")}</span>;
}
