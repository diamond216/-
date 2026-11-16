"use client";

import type { Endorsement } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";

/** "Who's tried it": named quotes from people who played, used or backed it. Hidden when there are none. */
export function TriedSection({ endorsements }: { endorsements: readonly Endorsement[] }) {
  const localizer = useLocalizer();
  if (endorsements.length === 0) return null;
  return (
    <section className="block" aria-labelledby="tried-title">
      <h2 className="sec" id="tried-title">
        {localizer.t("tried.title")}
      </h2>
      <p className="lead-in">{localizer.t("tried.lead")}</p>
      <div className="tried">
        {endorsements.map((endorsement) => (
          <figure key={endorsement.id}>
            <span className="kind mono">{localizer.text(endorsement.kind.label)}</span>
            <blockquote>“{localizer.text(endorsement.quoteInContext)}”</blockquote>
            <figcaption>
              <strong>{localizer.text(endorsement.author)}</strong> · {localizer.text(endorsement.authorRole)}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
