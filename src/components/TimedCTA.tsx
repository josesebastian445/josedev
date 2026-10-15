"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const DISMISSED_KEY = "joseviews:cta-dismissed";

export default function TimedCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch { /* Still dismiss when storage is unavailable. */ }
  };

  useEffect(() => {
    try { if (sessionStorage.getItem(DISMISSED_KEY)) return; } catch { /* The timer also works without storage. */ }
    const timer = window.setTimeout(() => setVisible(true), 30_000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || pathname.startsWith("/contact")) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, pathname]);

  return (
    <AnimatePresence>
      {visible && !pathname.startsWith("/contact") && (
        <motion.aside
          key="timed-cta"
          aria-labelledby="timed-cta-title"
          initial={{ opacity: 0, x: reduced ? 0 : 28, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: reduced ? 0 : 20 }}
          transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="timed-cta"
        >
          <button type="button" onClick={dismiss} className="timed-cta-close" aria-label="Dismiss contact invitation">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div className="timed-cta-eyebrow"><span /> LET&rsquo;S MAKE IT WORK</div>
          <h2 id="timed-cta-title">Your next step,<br /><span>sorted.</span></h2>
          <p>Need a faster website, a fresh build, or help fixing an issue? Tell me what you have in mind.</p>
          <Link href="/contact" onClick={dismiss} className="timed-cta-button" data-cursor="link">Let&rsquo;s talk <span aria-hidden="true">↗</span></Link>
          <div className="timed-cta-note">Jose Sebastian <span aria-hidden="true">·</span> Dubai, UAE</div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
