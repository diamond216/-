"use client";

import type { HubCheck, HubContribution } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";

/** "Hamster Hub's part in this": what the Hub put in, and the checks it passed. */
export function HubSection({ hub, checks }: { hub: HubContribution; checks: readonly HubCheck[] }) {
  const localizer = useLocalizer();
  return (
    <section className="block" aria-labelledby="hub-title">
      <h2 className="sec" id="hub-title">
        {localizer.t("hub.title")}
      </h2>
      <div className="hub">
        <p>{localizer.text(hub.summary)}</p>
        {checks.length > 0 && (
          <ul>
            {checks.map((check) => (
              <li key={check.id}>{localizer.text(check.label)}</li>
            ))}
          </ul>
        )}
      </div>
      <p className="checked">
        <a href="#">{localizer.t("hub.what")}</a>
      </p>
    </section>
  );
}
