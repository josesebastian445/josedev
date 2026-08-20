"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
export const THEME_KEY = "js-theme";

/**
 * Theme state, kept outside React so the inline boot script and the toggle
 * agree on one source of truth: the `data-theme` attribute on <html>.
 *
 * The store is deliberately not initialised from localStorage at module scope —
 * the boot script has already applied the attribute before hydration, so
 * reading the DOM is both correct and cheaper.
 */
let listeners = new Set<() => void>();

function current(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

let snapshot: Theme = "dark";

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setTheme(next: Theme) {
  const root = document.documentElement;
  root.dataset.theme = next;
  // marks the first *user-driven* change, so the boot paint is not cross-faded
  root.classList.add("theme-ready");
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Safari private mode and friends — the toggle still works for this page
  }
  snapshot = next;
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  setTheme(current() === "dark" ? "light" : "dark");
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (l) => {
      // sync the snapshot once on mount, after the boot script has run
      snapshot = current();
      return subscribe(l);
    },
    () => snapshot,
    // server render is always dark, matching the boot script's fallback
    () => "dark" as Theme
  );
}

/**
 * Runs before first paint, inline in <head>. Without this the page renders in
 * the server's dark default and then snaps to light — the classic flash.
 * Kept dependency-free and tiny because it blocks parsing.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{
var s=localStorage.getItem('${THEME_KEY}');
var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
document.documentElement.dataset.theme=t;
}catch(e){document.documentElement.dataset.theme='dark';}})();`;
