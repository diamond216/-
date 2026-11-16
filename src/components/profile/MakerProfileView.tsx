"use client";

import { useMemo } from "react";
import { useContactDialog } from "@/hooks/useContactDialog";
import { SiteFrame } from "../layout/SiteFrame";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { AskBand } from "./AskBand";
import { LatestBand } from "./LatestBand";
import { ProfileIntro } from "./ProfileIntro";
import { StorySection } from "./StorySection";
import { WorkSection } from "./WorkSection";

/** A maker's profile. The route hands over a slug; everything else comes from the services. */
export function MakerProfileView({ slug }: { slug: string }) {
  const localizer = useLocalizer();
  const { makerProfiles } = useNest();
  const profile = useMemo(() => makerProfiles.forSlug(slug), [makerProfiles, slug]);
  if (!profile) throw new Error(`No maker called ${slug}`);
  const { maker } = profile;
  const contact = useContactDialog(maker);

  return (
    <SiteFrame title={localizer.t("page.maker.title", { name: maker.name })}>
      <ProfileIntro maker={maker} numbers={profile.numbers} onWrite={contact.open} />
      {profile.latest && <LatestBand maker={maker} latest={profile.latest} strip={profile.strip} />}
      <WorkSection maker={maker} listings={profile.listings} />
      <StorySection maker={maker} colleague={profile.colleague} />
      <AskBand maker={maker} onWrite={() => contact.open()} />
      {contact.dialog}
    </SiteFrame>
  );
}
