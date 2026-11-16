"use client";

import Link from "next/link";
import { CardBody, CardContainer } from "@/components/ui/3d-card";
import type { Maker } from "@/domain";
import { Avatar } from "../common/Avatar";
import { paths } from "../common/links";
import { ContactDialog } from "../contact/ContactDialog";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { useState } from "react";

/** "Made by": the maker's line, how fast they reply, and the two ways to reach them. Keeps a slight tilt. */
export function MakerCard({ maker }: { maker: Maker }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const [writing, setWriting] = useState(false);
  const name = localizer.text(maker.nickname);

  return (
    <CardContainer>
      <CardBody>
        <div className="maker-card">
          <p className="mono">{localizer.t("maker.madeBy")}</p>
          <blockquote>“{localizer.text(maker.motto)}”</blockquote>
          <div className="who">
            <Avatar maker={maker} />
            <p>
              <strong>
                <Link href={paths.maker(maker.id)}>{maker.name}</Link>
              </strong>
              <span>
                {localizer.t("maker.roleYears", {
                  role: localizer.text(maker.role),
                  years: maker.yearsAtHub(clock.now()),
                })}
              </span>
            </p>
          </div>
          <p className="reply">
            <span className="dot" aria-hidden="true" />
            {localizer.t("maker.replyShort", { days: maker.story.replyTime.days })}
            {localizer.locale === "en" ? "." : ""}
          </p>
          <ContactDialog
            maker={maker}
            open={writing}
            onOpenChange={setWriting}
            trigger={
              <button className="btn" type="button">
                {localizer.t("note.cta", { name })}
              </button>
            }
          />
          <Link className="maker-card__more" href={paths.maker(maker.id)}>
            {localizer.t("maker.more", { name })}
          </Link>
        </div>
        <span className="glare" aria-hidden="true" />
      </CardBody>
    </CardContainer>
  );
}
