"use client";

import { useShelfQuery } from "@/hooks/useShelfQuery";
import { Hero } from "./hero/Hero";
import { SiteFrame } from "./layout/SiteFrame";
import { useLocalizer } from "./providers/NestProvider";
import { MakersBand } from "./sections/MakersBand";
import { TrustBand } from "./sections/TrustBand";
import { Voices } from "./sections/Voices";
import { ShelfSection } from "./shelf/ShelfSection";

export function HomePage() {
  const localizer = useLocalizer();
  const shelfQuery = useShelfQuery();
  const browse = () => document.getElementById("shelf")?.scrollIntoView({ block: "start" });

  return (
    <SiteFrame
      title={localizer.t("meta.title")}
      onHome
      skipTo={{ href: "#shelf", label: localizer.t("skip.shelf") }}
    >
      <Hero shelfQuery={shelfQuery} onBrowse={browse} />
      <ShelfSection shelfQuery={shelfQuery} />
      <TrustBand />
      <Voices />
      <MakersBand />
    </SiteFrame>
  );
}
