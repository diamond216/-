"use client";

import { useLocalizer } from "../providers/NestProvider";

/** Every page ends on Hamster Hub: who runs this, and where to reach them. */
export function Footer() {
  const localizer = useLocalizer();
  return (
    <footer className="hubfoot">
      <div className="wrap hubfoot__in">
        <div>
          <b>Hamster Hub</b>
          <span className="small">{localizer.t("foot.hub")}</span>
        </div>
        <div>
          <p>{localizer.t("foot.contacts")}</p>
          <span className="small">{localizer.t("foot.placeholders")}</span>
        </div>
      </div>
    </footer>
  );
}
