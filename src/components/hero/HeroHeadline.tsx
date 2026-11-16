"use client";

import { animate, stagger, utils } from "animejs";
import { useEffect, useRef } from "react";
import { motionAllowed } from "@/hooks/motionAllowed";
import { useLocalizer } from "../providers/NestProvider";

/** The headline. Its two lines rise in once when the page loads (anime.js owns them). */
export function HeroHeadline({ id }: { id: string }) {
  const localizer = useLocalizer();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = heading.current;
    if (!element) return;
    if (!motionAllowed()) {
      element.dataset.anim = "still";
      return;
    }
    const lines = element.querySelectorAll(".h-line");
    utils.set(lines, { opacity: 0 });
    element.dataset.anim = "running";
    const rise = animate(lines, {
      opacity: [0, 1],
      y: ["0.35em", "0em"],
      duration: 900,
      delay: stagger(140),
      ease: "outExpo",
    });
    return () => {
      rise.revert();
    };
  }, []);

  return (
    <h1 id={id} ref={heading} data-anim="pending">
      <span className="h-line">{localizer.t("hero.title.lead")}</span>{" "}
      <em className="h-line">{localizer.t("hero.title.accent")}</em>
    </h1>
  );
}
