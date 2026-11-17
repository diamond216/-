"use client";

import Link from "next/link";
import { useId, useMemo } from "react";
import { Category, type CategoryId } from "@/domain";
import { useRoomQuery } from "@/hooks/useRoomQuery";
import { SiteFrame } from "../layout/SiteFrame";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { RoomCard } from "./RoomCard";
import { RoomSidebar } from "./RoomSidebar";
import { RoomStrongest } from "./RoomStrongest";

/** A room's browse page: its name and search, a filter sidebar, the strongest three, then every match, newest first. */
export function RoomPageView({ roomId }: { roomId: CategoryId }) {
  const localizer = useLocalizer();
  const { shelf } = useNest();
  const room = Category.byId(roomId);
  const controls = useRoomQuery();
  const { query, genre, search, clear } = controls;
  const searchId = useId();

  const genres = useMemo(() => shelf.genreFacets(roomId), [shelf, roomId]);
  const view = useMemo(() => shelf.roomView(roomId, query), [shelf, roomId, query]);
  const listings = view.latest;
  const picked = genres.find((facet) => facet.genre.id === genre);
  const scope = picked ? localizer.text(picked.genre.label) : localizer.t(`room.${roomId}.everything`);
  if (!room) return null;

  return (
    <SiteFrame title={localizer.t("page.room.title", { room: room.tag })} room={roomId}>
      <div className="rhead">
        <div className="wrap rhead__in">
          <h1>{room.tag}</h1>
          <div>
            <p>{localizer.t(`room.${roomId}.lede`)}</p>
            <form className="rsearch" role="search" onSubmit={(event) => event.preventDefault()}>
              <label className="sr-only" htmlFor={searchId}>
                {localizer.t(`room.${roomId}.search`)}
              </label>
              <input
                id={searchId}
                type="search"
                autoComplete="off"
                value={query.text}
                onChange={(event) => search(event.target.value)}
                placeholder={localizer.t(`room.${roomId}.search`)}
              />
            </form>
          </div>
        </div>
      </div>

      <div className="wrap shell">
        <RoomSidebar roomId={roomId} roomSize={shelf.roomSize(roomId)} facets={genres} controls={controls} />
        <div className="shell__main">
          <RoomStrongest listings={view.strongest} />
          <div className="mhead mhead--row">
            <h2>{localizer.t("room.latest.title")}</h2>
            <p>{localizer.t("room.latest.count", { scope, count: listings.length })}</p>
            <span className="sort">{localizer.t("room.sort")}</span>
          </div>
          <div className="rgrid">
            {listings.map((listing) => (
              <RoomCard key={listing.id} listing={listing} />
            ))}
            {listings.length === 0 && (
              <div className="rempty" role="status">
                <p>{localizer.t("room.empty")}</p>
                <button className="b" type="button" onClick={clear}>
                  {localizer.t("filters.clear")}
                </button>
              </div>
            )}
            <div className="rcard rcard--post">
              <h3>{localizer.t(`room.${roomId}.postTitle`)}</h3>
              <p>{localizer.t(`room.${roomId}.postBody`)}</p>
              <Link className="b" href={paths.postTo(roomId)}>
                {localizer.t(`room.${roomId}.postCta`)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
