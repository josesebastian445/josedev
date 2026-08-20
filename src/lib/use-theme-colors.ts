"use client";

import { useSyncExternalStore } from "react";

/**
 * Watches `data-theme` on <html> for the WebGL scenes.
 *
 * The canvases cannot read CSS variables, so their materials need the theme as
 * a value. A MutationObserver is used rather than the theme store because
 * these components mount inside `dynamic(..., { ssr: false })` and may not
 * share a render pass with the toggle.
 */
function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => obs.disconnect();
}

export function useIsLight() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === "light",
    () => false
  );
}
