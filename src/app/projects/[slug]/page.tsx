import type { Metadata } from "next";
import { ProjectPageView } from "@/components/project/ProjectPageView";
import { staticCatalogue } from "@/composition/staticCatalogue";
import { en } from "@/services/i18n/en";

// Every project page is written out at build time; there's no server to make others on request.
export const dynamicParams = false;

export function generateStaticParams() {
  return staticCatalogue.projects.all().map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = staticCatalogue.projects.byId(slug);
  if (!project) return {};
  return {
    title: en["page.project.title"]({ name: project.name }),
    description: `${project.blurb.en} Updates, the money part, and how to reach the maker.`,
  };
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  return <ProjectPageView slug={slug} />;
}
