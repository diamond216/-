"use client";

import type { Maker } from "@/domain";
import type { MakerNumbers } from "@/services/pages";
import { PROFILE_WINDOW_DAYS } from "@/services/pages";
import { useLocalizer } from "../providers/NestProvider";

/** The top of a profile: who they are, what they'd talk about, a portrait card and three numbers. */
export function ProfileIntro({
  maker,
  numbers,
  onWrite,
}: {
  maker: Maker;
  numbers: MakerNumbers;
  /** Opens the contact form, optionally starting the message with a topic. */
  onWrite(body?: string): void;
}) {
  const localizer = useLocalizer();
  const { story } = maker;
  const name = localizer.text(maker.nickname);
  const languages = story.languages.map((id) => localizer.t(`language.${id}`)).join(", ");

  return (
    <section className="wrap me" aria-labelledby="me-name">
      <div className="me__main">
        <p className="mono">
          {localizer.t("profile.role", { role: localizer.text(maker.role), year: maker.joinedYear })}
        </p>
        <h1 id="me-name">{maker.name}</h1>
        <blockquote className="me__motto">“{localizer.text(maker.motto)}”</blockquote>
        <p className="me__intro">{localizer.text(story.intro)}</p>
        {story.talkTopics.length > 0 && (
          <div className="me__talk">
            <h2>{localizer.t("profile.talk")}</h2>
            <p className="chips">
              {story.talkTopics.map((topic) => {
                const label = localizer.text(topic);
                return (
                  <button
                    key={topic.en}
                    className="chip"
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => onWrite(localizer.t("profile.topicPrefill", { topic: label }))}
                  >
                    {label}
                  </button>
                );
              })}
            </p>
          </div>
        )}
        <p className="me__cta">
          <button className="btn" type="button" aria-haspopup="dialog" onClick={() => onWrite()}>
            {localizer.t("note.cta", { name })}
          </button>
          <span className="mono">
            <span className="dot" aria-hidden="true" />
            {localizer.t("maker.replyShort", { days: story.replyTime.days })} · {languages}
          </span>
        </p>
      </div>
      <div className="me__side">
        <figure className="portrait">
          <div className={`portrait__img portrait__img--${maker.tone}`} aria-hidden="true">
            {maker.initials.charAt(0)}
          </div>
          <figcaption className="mono">
            {story.portraitCaption ? localizer.text(story.portraitCaption) : localizer.t("profile.portrait")}
          </figcaption>
        </figure>
        <p className="me__nums" aria-label={localizer.t("profile.numbers")}>
          <span>
            <b>{numbers.projects}</b>
            {localizer.t("profile.projects", { count: numbers.projects })}
          </span>
          <span>
            <b>{numbers.updates}</b>
            {localizer.t("profile.updates", { days: PROFILE_WINDOW_DAYS })}
          </span>
          <span>
            <b>{numbers.awards}</b>
            {localizer.t("profile.awardsCount", { count: numbers.awards })}
          </span>
        </p>
      </div>
    </section>
  );
}
