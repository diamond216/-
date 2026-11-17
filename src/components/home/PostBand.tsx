"use client";

import { useLocalizer } from "../providers/NestProvider";

/** The invitation to people at Hamster Hub, just above the footer. */
export function PostBand() {
  const localizer = useLocalizer();
  return (
    <section className="post" id="post" aria-labelledby="post-title">
      <div className="wrap post__in">
        <h2 id="post-title">
          {localizer.t("post.title.first")}
          <br />
          {localizer.t("post.title.second")}
        </h2>
        <div>
          <p>{localizer.t("post.body")}</p>
          <a className="b" href="#">
            {localizer.t("nav.post")}
          </a>
        </div>
      </div>
    </section>
  );
}
