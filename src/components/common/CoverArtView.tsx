import type { CoverArt } from "@/domain";

/** A generated picture: a cover pattern in one colour. Decorative. */
export function CoverArtView({ art, className }: { art: CoverArt; className?: string }) {
  return (
    <div
      className={`cover cover--${art.pattern}${className ? ` ${className}` : ""}`}
      style={{ "--c": art.color } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
