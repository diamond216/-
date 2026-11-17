"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Category } from "@/domain";
import { ShelfQuery } from "@/services/shelf";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { Cover } from "../shelf/Cover";

const COVERS_PER_DOOR = 3;
const BUSIEST_FIRST = new ShelfQuery();

/** The four rooms as four doors. Each one already looks like the room behind it. */
export function RoomDoors() {
  const localizer = useLocalizer();
  const { shelf } = useNest();
  const rooms = useMemo(
    () =>
      Category.rooms().map((room) => ({
        room,
        covers: shelf.room(room.id, BUSIEST_FIRST).slice(0, COVERS_PER_DOOR),
      })),
    [shelf],
  );

  return (
    <section className="wrap sec" id="rooms" aria-labelledby="rooms-title">
      <h2 id="rooms-title">{localizer.t("rooms.title")}</h2>
      <p className="sec__lede">{localizer.t("rooms.lede")}</p>
      <div className="rooms">
        {rooms.map(({ room, covers }) => (
          <Link key={room.id} className={`door door--${room.id}`} href={paths.room(room.id)}>
            <h3>{room.tag}</h3>
            <p>{localizer.t(`room.${room.id}.line`)}</p>
            <span className="b">{localizer.t(`room.${room.id}.all`)}</span>
            <div className="door__art" aria-hidden="true">
              {covers.map((listing) => (
                <Cover key={listing.id} project={listing.project} />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
