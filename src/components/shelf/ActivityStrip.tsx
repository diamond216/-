"use client";

import { useEffect, useRef } from "react";
import { useLocalizer } from "../providers/NestProvider";

/** One tick per day, oldest on the left. Fills in from the left the first time it's scrolled into view (CSS). */
export function ActivityStrip({ days }: { days: readonly boolean[] }) {
  const localizer = useLocalizer();
  const strip = useRef<HTMLSpanElement>(null);
  const active = days.filter(Boolean).length;

  useEffect(() => {
    const element = strip.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.seen = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={strip}
      className="pulse"
      role="img"
      aria-label={localizer.t("card.strip", { active, days: days.length })}
    >
      {days.map((on, index) => (
        <i key={index} className={on ? "on" : undefined} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </span>
  );
}
