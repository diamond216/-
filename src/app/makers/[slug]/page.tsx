import type { Metadata } from "next";
import { MakerProfileView } from "@/components/profile/MakerProfileView";
import { staticCatalogue } from "@/composition/staticCatalogue";
import { en } from "@/services/i18n/en";

// Every profile is written out at build time; there's no server to make others on request.
export const dynamicParams = false;

export function generateStaticParams() {
  return staticCatalogue.makers.all().map((maker) => ({ slug: maker.id }));
}

export async function generateMetadata({ params }: PageProps<"/makers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const maker = staticCatalogue.makers.byId(slug);
  if (!maker) return {};
  return {
    title: en["page.maker.title"]({ name: maker.name }),
    description: maker.story.description.en,
  };
}

export default async function Page({ params }: PageProps<"/makers/[slug]">) {
  const { slug } = await params;
  return <MakerProfileView slug={slug} />;
}
