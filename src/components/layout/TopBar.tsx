"use client";

import { Moon, Sun } from "lucide-react";
import { LOCALES, type Locale } from "@/domain";
import { BrandMark } from "../common/BrandMark";
import { usePreferences } from "../providers/NestProvider";

const LOCALE_NAMES: Readonly<Record<Locale, string>> = { en: "EN", th: "ไทย" };

export function TopBar() {
  const { locale, theme, localizer, setLocale, setTheme } = usePreferences();
  const night = theme === "night";

  return (
    <header className="top">
      <a className="skip" href="#shelf">
        {localizer.t("skip.shelf")}
      </a>
      <div className="wrap top__in">
        <a className="brand" href="#" aria-label={localizer.t("brand.home")}>
          <BrandMark />
          <span className="brand__name">Hamster Nest</span>
          <span className="brand__by">{localizer.t("brand.by")}</span>
        </a>
        <nav className="top__nav" aria-label={localizer.t("nav.label")}>
          <a href="#shelf">{localizer.t("nav.browse")}</a>
          <a href="#">{localizer.t("nav.makers")}</a>
          <a href="#">{localizer.t("nav.investors")}</a>
          <a href="#trust">{localizer.t("nav.howWePick")}</a>
        </nav>
        <div className="top__prefs">
          <div className="lang" role="group" aria-label={localizer.t("lang.label")}>
            {LOCALES.map((option) => (
              <button
                key={option}
                type="button"
                lang={option}
                aria-pressed={locale === option}
                onClick={() => setLocale(option)}
              >
                {LOCALE_NAMES[option]}
              </button>
            ))}
          </div>
          <button
            className="theme"
            type="button"
            aria-pressed={night}
            aria-label={localizer.t("theme.night")}
            title={localizer.t("theme.night")}
            onClick={() => setTheme(night ? "day" : "night")}
          >
            {night ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
        </div>
        <a className="btn" href="#makers">
          {localizer.t("nav.post")}
        </a>
      </div>
    </header>
  );
}
