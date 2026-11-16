"use client";

import type { Endorsement, Maker } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";

/** "How I got here", awards and mentions, and a word from a colleague. Each part hides when empty. */
export function StorySection({ maker, colleague }: { maker: Maker; colleague?: Endorsement }) {
  const localizer = useLocalizer();
  const { timeline, recognitions } = maker.story;
  if (timeline.length === 0 && recognitions.length === 0 && !colleague) return null;

  return (
    <section className="wrap story" aria-labelledby="story-title">
      <h2 className="sec" id="story-title">
        {localizer.t("profile.story")}
      </h2>
      {timeline.length > 0 && (
        <ol>
          {timeline.map((entry) => (
            <li key={`${entry.year}-${entry.text.en}`}>
              <span className="mono">{entry.year}</span>
              <p>{localizer.text(entry.text)}</p>
            </li>
          ))}
        </ol>
      )}
      {recognitions.length > 0 && (
        <div className="story__awards">
          <h3>{localizer.t("profile.awards")}</h3>
          <ul>
            {recognitions.map((item) => (
              <li key={`${item.year}-${item.title.en}`}>
                <span className="mono">{item.year}</span>
                <span>{localizer.text(item.title)}</span>
                <span>{localizer.text(item.from)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {colleague && (
        <figure className="story__voice">
          <blockquote>“{localizer.text(colleague.quote)}”</blockquote>
          <figcaption>
            <strong>{localizer.text(colleague.author)}</strong> · {localizer.text(colleague.authorRole)}
          </figcaption>
        </figure>
      )}
    </section>
  );
}
