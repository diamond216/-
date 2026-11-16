"use client";

import { useLocalizer } from "../providers/NestProvider";

export function Footer() {
  const localizer = useLocalizer();
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <p>{localizer.t("foot.run")}</p>
        <nav aria-label={localizer.t("foot.label")}>
          <a href="#">{localizer.t("foot.howWePick")}</a>
          <a href="#">{localizer.t("foot.ranking")}</a>
          <a href="#">{localizer.t("foot.investors")}</a>
          <a href="#">{localizer.t("foot.contact")}</a>
        </nav>
        <p className="mono">{localizer.t("foot.note")}</p>
      </div>
    </footer>
  );
}
