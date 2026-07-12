"use client";

import { useState, useEffect } from "react";
import { site } from "@/lib/site";
import { Icon } from "./icons";

/** Live local time in Joseph's timezone (Ohio / ET). */
export function LocalClock() {
  const [time, setTime] = useState("");
  const [zone, setZone] = useState("ET");
  const [iso, setIso] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: site.timeZone,
        }).format(now)
      );
      setIso(now.toISOString());
      setZone(
        new Intl.DateTimeFormat("en-US", {
          timeZone: site.timeZone,
          timeZoneName: "short",
        })
          .formatToParts(now)
          .find((p) => p.type === "timeZoneName")?.value ?? "ET"
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--ink-faint)]">
      <Icon.clock className="h-3.5 w-3.5" />
      <time dateTime={iso} className="tabular-nums" suppressHydrationWarning>
        {time || " "}
      </time>
      <span>{zone}</span>
    </span>
  );
}
