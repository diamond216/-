import type { Metadata } from "next";
import { RoomPageView } from "@/components/room/RoomPageView";
import { Category, type CategoryId } from "@/domain";
import { en } from "@/services/i18n/en";

// The four rooms are written out at build time: /game/, /iot/, /web/, /idea/. Nothing else matches here.
export const dynamicParams = false;

export function generateStaticParams() {
  return Category.rooms().map((room) => ({ room: room.id }));
}

export async function generateMetadata({ params }: PageProps<"/[room]">): Promise<Metadata> {
  const { room } = await params;
  const category = Category.byId(room);
  if (!category) return {};
  return {
    title: en["page.room.title"]({ room: category.tag }),
    description: en[`room.${category.id}.lede`],
  };
}

export default async function Page({ params }: PageProps<"/[room]">) {
  const { room } = await params;
  return <RoomPageView roomId={room as CategoryId} />;
}
