"use client";

import { useMemo } from "react";
import type { MessageKey } from "@/services/i18n";
import { useLocalizer, useNest } from "../providers/NestProvider";

const RULES = [1, 2, 3, 4] as const;

/** The bottom of the home page: who Hamster Hub is, the four promises, and one person who tried something here. */
export function AboutHub() {
  const localizer = useLocalizer();
  const { endorsements } = useNest();
  const quote = useMemo(() => endorsements.quotable()[0], [endorsements]);

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about__in">
        <div>
          <h2 id="about-title">{localizer.t("about.title")}</h2>
          <p>{localizer.t("about.lede")}</p>
          <a className="b b--line" href="#">
            {localizer.t("about.cta")}
          </a>
        </div>
        <ul>
          {RULES.map((n) => (
            <li key={n}>
              <strong>{localizer.t(`trust.rule${n}.title` as MessageKey & `trust.rule${number}.title`)}</strong>
              <p>{localizer.t(`trust.rule${n}.body` as MessageKey & `trust.rule${number}.body`)}</p>
            </li>
          ))}
        </ul>
      </div>
      {quote && (
        <figure className="wrap about__quote">
          <blockquote>“{localizer.text(quote.quote)}”</blockquote>
          <figcaption>
            <p>{localizer.list([localizer.text(quote.author), localizer.text(quote.authorRole)])}</p>
          </figcaption>
        </figure>
      )}
    </section>
  );
}
