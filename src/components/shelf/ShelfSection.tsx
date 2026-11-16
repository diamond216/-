"use client";

import { useMemo, useState } from "react";
import type { ShelfQueryControls } from "@/hooks/useShelfQuery";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { FeaturedCard } from "./FeaturedCard";
import { Feed } from "./Feed";
import { FilterPanel } from "./FilterPanel";
import { ProjectCard } from "./ProjectCard";
import { RevealList } from "./RevealList";
import { ShelfTabs } from "./ShelfTabs";

const PAGE_SIZE = 6;
const FEED_SIZE = 6;

/** Tabs, filters, the busiest three, the card grid and the feed. */
export function ShelfSection({ shelfQuery }: { shelfQuery: ShelfQueryControls }) {
  const localizer = useLocalizer();
  const { shelf, digest } = useNest();
  const { query, clear } = shelfQuery;
  const [shown, setShown] = useState(PAGE_SIZE);

  const counts = useMemo(() => shelf.categoryCounts(), [shelf]);
  const facets = useMemo(() => shelf.genreFacets(query.category), [shelf, query.category]);
  const feed = useMemo(() => digest.feed(FEED_SIZE), [digest]);
  const view = useMemo(() => shelf.browse(query), [shelf, query]);

  const cards = view.rest.slice(0, shown);
  const category = counts.find((entry) => entry.category.id === query.category)?.category;
  const scope = category ? localizer.text(category.label) : localizer.t("fresh.everyCategory");

  return (
    <section className="shelf" id="shelf" aria-label={localizer.t("shelf.label")}>
      <ShelfTabs counts={counts} total={shelf.size()} shelfQuery={shelfQuery} />

      <div className="wrap shelf__grid">
        <FilterPanel facets={facets} shelfQuery={shelfQuery} />

        <div className="shelf__main">
          {query.isNarrowed && (
            <p className="mono results" role="status">
              {localizer.t("results.count", { count: view.total, text: query.text.trim() })}
            </p>
          )}

          {view.total === 0 ? (
            <div className="empty">
              <p>{localizer.t("results.empty")}</p>
              <button className="btn btn--ghost" type="button" onClick={clear}>
                {localizer.t("filters.clear")}
              </button>
            </div>
          ) : (
            <>
              <header className="sec-head">
                <h2>{localizer.t("busiest.title")}</h2>
                <p>
                  <span>{localizer.t("busiest.sub")}</span> <a href="#">{localizer.t("busiest.link")}</a>
                </p>
              </header>
              <RevealList
                className="top3"
                items={view.featured}
                keyOf={(listing) => listing.id}
                render={(listing, index) => <FeaturedCard listing={listing} rank={index + 1} big={index === 0} />}
              />

              {cards.length > 0 && (
                <>
                  <header className="sec-head">
                    <h2>{localizer.t("fresh.title")}</h2>
                    <p>{localizer.t("fresh.sub", { scope, order: localizer.t(`fresh.order.${query.sort}`) })}</p>
                  </header>
                  <RevealList
                    className="cards"
                    items={cards}
                    keyOf={(listing) => `${query.sort}-${listing.id}`}
                    render={(listing) => <ProjectCard listing={listing} />}
                  />
                  {view.rest.length > shown && (
                    <p className="more">
                      <button className="btn btn--ghost" type="button" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                        {localizer.t("more.button")}
                      </button>
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <Feed entries={feed} />
      </div>
    </section>
  );
}
