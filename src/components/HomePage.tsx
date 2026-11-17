"use client";

import { AboutHub } from "./home/AboutHub";
import { BeforeNow } from "./home/BeforeNow";
import { BestOfRooms } from "./home/BestOfRooms";
import { PostBand } from "./home/PostBand";
import { RoomDoors } from "./home/RoomDoors";
import { Statement } from "./home/Statement";
import { SiteFrame } from "./layout/SiteFrame";
import { useLocalizer } from "./providers/NestProvider";

/** Home, top to bottom: the statement, the best of each room, the four rooms, what changed, and Hamster Hub. */
export function HomePage() {
  const localizer = useLocalizer();
  return (
    <SiteFrame title={localizer.t("meta.title")} skipTo={{ href: "#rooms", label: localizer.t("skip.rooms") }}>
      <Statement />
      <BestOfRooms />
      <RoomDoors />
      <BeforeNow />
      <AboutHub />
      <PostBand />
    </SiteFrame>
  );
}
