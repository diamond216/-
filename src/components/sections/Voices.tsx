"use client";

import { useMemo } from "react";
import { useLocalizer, useNest } from "../providers/NestProvider";

/** Two quotes, deliberately not lined up: the first big, the second smaller and offset. */
export function Voices() {
  const localizer = useLocalizer();
  const { endorsements } = useNest();
  const quotes = useMemo(() => endorsements.quotable().slice(0, 2), [endorsements]);

  return (
    <section className="voices wrap" aria-labelledby="voices-title">
      <div className="voices__head">
        <h2 id="voices-title">{localizer.t("voices.title")}</h2>
        <p>{localizer.t("voices.lede")}</p>
      </div>
      {quotes.map((quote, index) => (
        <figure key={quote.id} className={index === 0 ? "voice voice--a" : "voice voice--b"}>
          <blockquote>“{localizer.text(quote.quote)}”</blockquote>
          <figcaption>
            <strong>{localizer.text(quote.author)}</strong> <span>{localizer.text(quote.authorRole)}</span>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
