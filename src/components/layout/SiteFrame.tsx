"use client";

import type { ReactNode } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useLocalizer } from "../providers/NestProvider";
import { Footer } from "./Footer";
import { TopBar } from "./TopBar";

/** Header, main and footer, shared by every page. */
export function SiteFrame({
  title,
  onHome = false,
  skipTo,
  children,
}: {
  title: string;
  onHome?: boolean;
  skipTo?: { href: string; label: string };
  children: ReactNode;
}) {
  const localizer = useLocalizer();
  usePageTitle(title);
  return (
    <>
      <TopBar onHome={onHome} skipTo={skipTo ?? { href: "#content", label: localizer.t("skip.main") }} />
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}
