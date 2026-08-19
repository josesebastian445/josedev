"use client";

import { useSyncExternalStore } from "react";

/**
 * Tracks whether the intro curtain has lifted, so page content can hold its
 * entrance animations until there is somebody to see them.
 *
 * The server snapshot is always `false` and the store starts `false` on the
 * client too — the Preloader flips it in an effect, after hydration, which
 * keeps the first client render identical to the server's.
 */
let done = false;
const listeners = new Set<() => void>();

export function completeIntro() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false
  );
}

export const INTRO_SESSION_KEY = "js-intro-seen";
