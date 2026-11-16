import type { Maker } from "@/domain";

/** A maker's initials on their colour. Decorative: the name is always written next to it. */
export function Avatar({ maker }: { maker: Maker }) {
  return (
    <span className={`av av--${maker.tone}`} aria-hidden="true">
      {maker.initials}
    </span>
  );
}
