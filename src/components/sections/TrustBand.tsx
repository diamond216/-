"use client";

import type { MessageKey } from "@/services/i18n";
import { useLocalizer } from "../providers/NestProvider";

const RULES = [1, 2, 3, 4] as const;

export function TrustBand() {
  const localizer = useLocalizer();
  return (
    <section className="trust" id="trust" aria-labelledby="trust-title">
      <div className="wrap trust__grid">
        <div className="trust__head">
          <h2 id="trust-title">{localizer.t("trust.title")}</h2>
          <p>{localizer.t("trust.lede")}</p>
          <a className="btn btn--ghost" href="#">
            {localizer.t("trust.cta")}
          </a>
        </div>
        <ol className="rules">
          {RULES.map((n) => (
            <li key={n}>
              <span className="mono">{localizer.twoDigits(n)}</span>
              <div>
                <h3>{localizer.t(`trust.rule${n}.title` as MessageKey & `trust.rule${number}.title`)}</h3>
                <p>{localizer.t(`trust.rule${n}.body` as MessageKey & `trust.rule${number}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
