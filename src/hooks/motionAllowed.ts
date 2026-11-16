"use client";

/** True unless the visitor asked their system for less motion. Safe to call in effects and handlers. */
export function motionAllowed(): boolean {
  return typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
