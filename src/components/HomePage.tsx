"use client";

import { useShelfQuery } from "@/hooks/useShelfQuery";
import { Hero } from "./hero/Hero";
import { Footer } from "./layout/Footer";
import { TopBar } from "./layout/TopBar";
import { MakersBand } from "./sections/MakersBand";
import { TrustBand } from "./sections/TrustBand";
import { Voices } from "./sections/Voices";
import { ShelfSection } from "./shelf/ShelfSection";

export function HomePage() {
  const shelfQuery = useShelfQuery();
  const browse = () => document.getElementById("shelf")?.scrollIntoView({ block: "start" });

  return (
    <>
      <TopBar />
      <main>
        <Hero shelfQuery={shelfQuery} onBrowse={browse} />
        <ShelfSection shelfQuery={shelfQuery} />
        <TrustBand />
        <Voices />
        <MakersBand />
      </main>
      <Footer />
    </>
  );
}
