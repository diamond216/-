"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { Category, type CategoryId, LOCALES, type Locale } from "@/domain";
import { BrandMark } from "../common/BrandMark";
import { paths } from "../common/links";
import { usePreferences } from "../providers/NestProvider";

const LOCALE_NAMES: Readonly<Record<Locale, string>> = { en: "EN", th: "ไทย" };

/** Same header on every page: the four rooms, then Hamster Hub. */
export function TopBar({ room, skipTo }: { room?: CategoryId; skipTo: { href: string; label: string } }) {
  const { locale, theme, localizer, setLocale, setTheme } = usePreferences();
  const night = theme === "night";

  return (
    <header className="top">
      <a className="skip" href={skipTo.href}>
        {skipTo.label}
      </a>
      <div className="wrap top__in">
        <Link className="brand" href="/" aria-label={localizer.t("brand.home")}>
          <BrandMark />
          <span className="brand__name">Hamster Nest</span>
          <span className="brand__by">{localizer.t("brand.by")}</span>
        </Link>
        <nav className="top__nav" aria-label={localizer.t("nav.label")}>
          {Category.rooms().map((category) => (
            <Link
              key={category.id}
              href={paths.room(category.id)}
              aria-current={category.id === room ? "page" : undefined}
            >
              {category.tag}
            </Link>
          ))}
          <Link href={paths.about}>{localizer.t("nav.about")}</Link>
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
        <Link className="b" href={paths.post}>
          {localizer.t("nav.post")}
        </Link>
      </div>
    </header>
  );
}
