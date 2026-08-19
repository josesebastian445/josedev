"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * The case-study hero plate. The artwork scales down and the mock UI drifts up
 * as you scroll past, so the page opens with movement rather than a static
 * image. Stands in for a real screenshot or product video.
 */
export default function ScrollReadout({ art }: { art: [string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1.12, 1]);
  const uiY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0.55, 1], [1, 0.35]);

  return (
    <div ref={ref} className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <motion.div
        style={{ opacity: fade }}
        className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line"
      >
        <motion.div
          style={{
            scale,
            background: `radial-gradient(120% 100% at 22% 0%, ${art[0]}, ${art[1]} 62%)`,
          }}
          className="absolute inset-0"
        />

        <motion.div
          style={{ y: uiY }}
          className="absolute inset-x-[8%] top-[14%] rounded-2xl border border-bone/15 bg-ink/45 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 border-b border-bone/10 px-5 py-4">
            <span className="h-2.5 w-2.5 rounded-full bg-bone/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-bone/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-bone/25" />
            <span className="ml-4 h-2.5 w-40 rounded-full bg-bone/15" />
          </div>
          <div className="space-y-4 p-7 md:p-10">
            <span className="block h-4 w-1/2 rounded-full bg-bone/25" />
            <span className="block h-3 w-2/3 rounded-full bg-bone/15" />
            <div className="grid grid-cols-3 gap-4 pt-5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-20 rounded-lg bg-bone/10 md:h-28"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
