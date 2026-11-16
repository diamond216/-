"use client";

import { animate, createScope, stagger, svg } from "animejs";
import { useEffect, useMemo, useRef } from "react";
import { motionAllowed } from "@/hooks/motionAllowed";
import type { ShelfStats, WheelTick } from "@/services/shelf";
import { useLocalizer } from "../providers/NestProvider";
import { WheelGeometry } from "./WheelGeometry";

const geometry = new WheelGeometry();

/**
 * The hero instrument: one tick per update in the last 30 days, today's in the accent colour.
 * anime.js owns every moving part in here: ticks draw in once, then the ring turns slowly.
 */
export function UpdateWheel({ ticks, stats }: { ticks: readonly WheelTick[]; stats: ShelfStats }) {
  const localizer = useLocalizer();
  const figure = useRef<HTMLElement>(null);
  const lines = useMemo(() => geometry.tickLines(ticks), [ticks]);
  const { cx, cy } = geometry;

  useEffect(() => {
    const root = figure.current;
    if (!root) return;
    if (!motionAllowed()) {
      root.dataset.anim = "still";
      return;
    }
    const scope = createScope({ root }).add(() => {
      animate(svg.createDrawable(".w-tick"), {
        draw: ["0 0", "0 1"],
        duration: 700,
        delay: stagger(9),
        ease: "outExpo",
      });
      animate(".wheel__ring", { rotate: 360, duration: 180_000, ease: "linear", loop: true });
    });
    root.dataset.anim = "running";
    return () => scope.revert();
  }, []);

  return (
    <figure className="wheel" ref={figure} data-anim="pending">
      <svg
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        role="img"
        aria-label={localizer.t("wheel.aria", {
          updates: stats.updates,
          days: stats.windowDays,
          today: stats.projectsUpdatedToday,
          open: stats.openToInvestment,
          paused: stats.paused,
        })}
      >
        <circle cx={cx} cy={cy} r={geometry.ringRadius} className="w-line" />
        <circle cx={cx} cy={cy} r={geometry.innerRadius} className="w-line" strokeDasharray="2 7" />
        <g className="wheel__ring">
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className={line.today ? "w-tick w-tick--today" : "w-tick"}
            />
          ))}
          {geometry.spokes().map((spoke, index) => (
            <line key={index} {...spoke} className="w-line" />
          ))}
        </g>
        <path d={geometry.arcPath(stats.thisWeekShare)} className="w-arc" />
        <circle cx={cx} cy={cy} r={geometry.hubRadius} className="w-hub" />
        <text x={cx} y={cy + 6} className="w-num">
          {stats.updates}
        </text>
        <text x={cx} y={cy + 24} className="w-cap">
          {localizer.t("wheel.caption", { days: stats.windowDays })}
        </text>
        <Callout degrees={-140} knee={[96, 44]} endX={8} anchor="start">
          {localizer.twoDigits(stats.projectsUpdatedToday)} {localizer.t("wheel.today")}
        </Callout>
        <Callout degrees={180} knee={[70, 210]} endX={8} anchor="start">
          {localizer.twoDigits(stats.paused)} {localizer.t("wheel.paused")}
        </Callout>
        <Callout degrees={-42} knee={[420, 44]} endX={474} anchor="end">
          {localizer.twoDigits(stats.openToInvestment)} {localizer.t("wheel.open")}
        </Callout>
      </svg>
    </figure>
  );
}

function Callout({
  degrees,
  knee,
  endX,
  anchor,
  children,
}: {
  degrees: number;
  knee: readonly [number, number];
  endX: number;
  anchor: "start" | "end";
  children: React.ReactNode;
}) {
  return (
    <>
      <polyline points={geometry.calloutPoints(degrees, knee, endX)} className="w-lead" />
      <text x={endX} y={knee[1] - 7} className="w-label" textAnchor={anchor}>
        {children}
      </text>
    </>
  );
}
