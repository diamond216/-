"use client";

import type { ReactNode } from "react";
import type { CategoryId } from "@/domain";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useLocalizer } from "../providers/NestProvider";
import { Footer } from "./Footer";
import { TopBar } from "./TopBar";

/** Header, main and footer, shared by every page. Inside a room, the whole frame takes that room's look. */
export function SiteFrame({
  title,
  room,
  skipTo,
  children,
}: {
  title: string;
  /** The room this page belongs to, if any. */
  room?: CategoryId;
  skipTo?: { href: string; label: string };
  children: ReactNode;
}) {
  const localizer = useLocalizer();
  usePageTitle(title);
  return (
    <div className={room ? `room room--${room}` : undefined}>
      <TopBar room={room} skipTo={skipTo ?? { href: "#content", label: localizer.t("skip.main") }} />
      <main id="content">{children}</main>
      <Footer />
    </div>
  );
}
