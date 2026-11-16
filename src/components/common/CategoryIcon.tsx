import type { CategoryId } from "@/domain";
import type { ReactNode } from "react";

/** Line icons for the four shelves, drawn to match the draft. */
const SHAPES: Readonly<Record<CategoryId, ReactNode>> = {
  game: (
    <>
      <rect x="2" y="7" width="20" height="11" rx="5.5" />
      <path d="M7 10.5v4M5 12.5h4" />
      <circle cx="15.5" cy="11.3" r=".9" />
      <circle cx="18" cy="13.8" r=".9" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
    </>
  ),
  iot: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    </>
  ),
  idea: <path d="M9.5 17h5M10.5 20h3M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2v.2h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />,
};

export function CategoryIcon({ category }: { category: CategoryId }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      {SHAPES[category]}
    </svg>
  );
}
