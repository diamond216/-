"use client";

import { useMemo } from "react";
import { SiteFrame } from "../layout/SiteFrame";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { FactsList } from "./FactsList";
import { HubSection } from "./HubSection";
import { MakerCard } from "./MakerCard";
import { MoneySection } from "./MoneySection";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectShowcase } from "./ProjectShowcase";
import { TriedSection } from "./TriedSection";
import { UpdateStreamSection } from "./UpdateStreamSection";

/** A project's page. The route hands over a slug; everything else comes from the services. */
export function ProjectPageView({ slug }: { slug: string }) {
  const localizer = useLocalizer();
  const { projectPages } = useNest();
  const page = useMemo(() => projectPages.forSlug(slug), [projectPages, slug]);
  if (!page) throw new Error(`No project called ${slug}`);
  const { project, maker } = page.listing;

  return (
    <SiteFrame title={localizer.t("page.project.title", { name: project.name })}>
      <div className="wrap">
        <ProjectHeader page={page} />
        <div className="proj__grid">
          <div className="proj__main">
            <ProjectShowcase project={project} />
            <UpdateStreamSection stream={page.stream} />
            {project.ledger && <MoneySection ledger={project.ledger} />}
            {project.hub && <HubSection hub={project.hub} checks={page.hubChecks} />}
            <TriedSection endorsements={page.endorsements} />
          </div>
          <aside className="proj__side">
            <MakerCard maker={maker} />
            <FactsList project={project} />
          </aside>
        </div>
      </div>
    </SiteFrame>
  );
}
