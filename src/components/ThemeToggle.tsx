"use client";

import { motion } from "motion/react";
import { toggleTheme, useTheme } from "@/lib/theme";

/**
 * Dark/light switch. The knob slides; the icons cross-fade with it.
 *
 * The server always renders the dark state, so the control is aria-hidden from
 * the label's point of view until mounted — `useTheme` reads the attribute the
 * boot script set, which means the first client render already matches the DOM.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-cursor="link"
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      className={`group relative inline-flex h-9 w-[3.75rem] shrink-0 items-center rounded-full border border-line bg-ink-2/70 px-1 transition-colors duration-400 hover:border-fog/50 ${className}`}
    >
      {/* the knob */}
      <motion.span
        aria-hidden
        animate={{ x: light ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-volt text-on-accent"
      >
        {light ? (
          /* sun */
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="8" cy="8" r="3.1" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2L3.1 3.1" />
            </g>
          </svg>
        ) : (
          /* moon */
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M13.4 9.6A5.8 5.8 0 0 1 6.4 2.6a5.8 5.8 0 1 0 7 7Z"
              fill="currentColor"
            />
          </svg>
        )}
      </motion.span>

      {/* the track dims on the side the knob has left */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px rgb(200 255 46 / 0.25)" }}
      />
    </button>
  );
}
