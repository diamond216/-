"use client";

import { animate, createScope, stagger, svg } from "animejs";
import { useEffect, useMemo, useRef } from "react";
import { motionAllowed } from "@/hooks/motionAllowed";
import type { MomentumKey, MomentumSlice, ShelfStats } from "@/services/shelf";
import { useLocalizer } from "../providers/NestProvider";
import { DonutGeometry } from "./DonutGeometry";

const geometry = new DonutGeometry();

const LABELS: Record<MomentumKey, "donut.today" | "donut.open" | "donut.building" | "donut.paused"> = {
  today: "donut.today",
  open: "donut.open",
  building: "donut.building",
  paused: "donut.paused",
};

/**
 * The hero donut: every project on the shelf, split by what it's up to right now.
 * anime.js owns the motion here: the slices draw round once, one after another.
 */
export function UpdateDonut({ slices, stats }: { slices: readonly MomentumSlice[]; stats: ShelfStats }) {
  const localizer = useLocalizer();
  const figure = useRef<HTMLElement>(null);
  const pieces = useMemo(() => geometry.pieces(slices), [slices]);
  const count = (key: MomentumKey) => slices.find((slice) => slice.key === key)?.count ?? 0;
  const { center, size } = geometry;

  useEffect(() => {
    const root = figure.current;
    if (!root) return;
    if (!motionAllowed()) {
      root.dataset.anim = "still";
      return;
    }
    const scope = createScope({ root }).add(() => {
      animate(svg.createDrawable(".donut__slice"), {
        draw: ["0 0", "0 1"],
        opacity: [1, 1],
        duration: 900,
        delay: stagger(220, { start: 150 }),
        ease: "outCubic",
      });
      animate(".donut__dot", { opacity: [0, 1], scale: [0.2, 1], duration: 500, delay: 150 + pieces.length * 220, ease: "outBack" });
      animate(".donut__legend li", { opacity: [0, 1], translateX: [-8, 0], duration: 500, delay: stagger(220, { start: 300 }), ease: "outCubic" });
    });
    root.dataset.anim = "running";
    return () => scope.revert();
  }, [pieces.length]);

  return (
    <figure className="donut" ref={figure} data-anim="pending">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={localizer.t("donut.aria", {
          updates: stats.updates,
          days: stats.windowDays,
          today: count("today"),
          open: count("open"),
          building: count("building"),
          paused: count("paused"),
        })}
      >
        <circle cx={center} cy={center} r={geometry.holeRadius} className="donut__hole" />
        <circle cx={center} cy={center} r={geometry.holeRadius} className="donut__rim" />
        {pieces.map((piece) =>
          piece.shape.kind === "arc" ? (
            <path key={piece.key} d={piece.shape.d} className={`donut__slice donut--${piece.key}`} />
          ) : (
            <circle
              key={piece.key}
              cx={piece.shape.cx}
              cy={piece.shape.cy}
              r={piece.shape.r}
              className={`donut__dot donut--${piece.key}`}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          ),
        )}
        <text x={center} y={center + 8} className="donut__num">
          {stats.updates}
        </text>
        <text x={center} y={center + 30} className="donut__cap">
          {localizer.t("donut.caption")}
        </text>
      </svg>
      <ul className="donut__legend" aria-hidden="true">
        {slices.map((slice) => (
          <li key={slice.key} className={`donut--${slice.key}`}>
            <i />
            <b>{slice.count}</b>
            <span>{localizer.t(LABELS[slice.key])}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
