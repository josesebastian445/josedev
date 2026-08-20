"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Types a string out character by character, then deletes it and moves to the
 * next one. A terminal cursor, basically.
 *
 * Accessibility: the animated text is aria-hidden and the full first phrase is
 * exposed to assistive tech as static text, so a screen reader gets
 * "Jose Sebastian" once rather than one character at a time. Under
 * prefers-reduced-motion nothing animates — the first phrase renders whole.
 */
export default function Typewriter({
  phrases,
  className,
  cursorClassName = "bg-volt",
  typeMs = 65,
  deleteMs = 32,
  holdMs = 1900,
  /** never delete the last phrase — types once and stops */
  once = false,
}: {
  phrases: string[];
  className?: string;
  cursorClassName?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const full = phrases[0] ?? "";

  // Start with the whole first phrase so the server render and the first
  // client render agree; the effect takes over afterwards.
  const [shown, setShown] = useState(full);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduced || phrases.length === 0) return;

    let phrase = 0;
    let char = 0;
    let deleting = false;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      const target = phrases[phrase];

      if (!deleting) {
        char++;
        setShown(target.slice(0, char));
        if (char === target.length) {
          const last = phrase === phrases.length - 1;
          if (once && last) {
            setDone(true);
            return;
          }
          deleting = true;
          timer.current = setTimeout(step, holdMs);
          return;
        }
        timer.current = setTimeout(step, typeMs);
        return;
      }

      char--;
      setShown(target.slice(0, char));
      if (char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
      }
      timer.current = setTimeout(step, deleteMs);
    };

    // restart from empty so the first phrase types in rather than appearing
    setShown("");
    char = 0;
    timer.current = setTimeout(step, 420);

    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [phrases, reduced, typeMs, deleteMs, holdMs, once]);

  return (
    <span className={className}>
      <span className="sr-only">{full}</span>
      <span aria-hidden>
        {shown}
        {!reduced && !done && (
          <span
            className={`ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.12em] animate-pulse align-baseline ${cursorClassName}`}
          />
        )}
      </span>
    </span>
  );
}
