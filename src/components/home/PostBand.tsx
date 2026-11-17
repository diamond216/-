"use client";

import Link from "next/link";
import { paths } from "../common/links";
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
          <Link className="b" href={paths.post}>
            {localizer.t("nav.post")}
          </Link>
        </div>
      </div>
    </section>
  );
}
