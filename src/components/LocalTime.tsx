"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/content/site";

/**
 * Jose's local time, ticking.
 *
 * Renders nothing on the server and until after hydration: the server has no
 * idea what time it is in Dubai relative to the visitor, and rendering a guess
 * would be a hydration mismatch on every page load.
 */
export default function LocalTime() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: SITE.timezone,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">
      {now ? `${now} GST` : " "}
    </span>
  );
}
