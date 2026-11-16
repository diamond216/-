"use client";

import { MotionConfig } from "motion/react";
import { NuqsAdapter } from "nuqs/adapters/react";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createNest, type Nest } from "@/composition/createNest";
import type { Locale } from "@/domain";
import { Localizer } from "@/services/i18n";
import type { Theme } from "@/services/preferences/PreferenceStore";

interface Preferences {
  locale: Locale;
  theme: Theme;
  localizer: Localizer;
  setLocale(locale: Locale): void;
  setTheme(theme: Theme): void;
}

const NestContext = createContext<Nest | null>(null);
const PreferencesContext = createContext<Preferences | null>(null);

/**
 * Builds the app's services once and hands them down. Also keeps <html> in step with
 * the visitor's language and theme, and tells motion to respect reduced-motion settings.
 */
export function NestProvider({ children }: { children: ReactNode }) {
  const [nest] = useState(() => createNest());
  const { locale: localeStore, theme: themeStore } = nest.preferences;

  const locale = useSyncExternalStore(localeStore.subscribe, localeStore.get, localeStore.getDefault);
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get, themeStore.getDefault);

  const preferences = useMemo<Preferences>(
    () => ({
      locale,
      theme,
      localizer: Localizer.for(locale),
      setLocale: (next) => localeStore.set(next),
      setTheme: (next) => themeStore.set(next),
    }),
    [locale, theme, localeStore, themeStore],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    if (theme === "night") root.dataset.theme = "night";
    else delete root.dataset.theme;
  }, [locale, theme]);

  return (
    <NestContext.Provider value={nest}>
      <PreferencesContext.Provider value={preferences}>
        <NuqsAdapter>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </NuqsAdapter>
      </PreferencesContext.Provider>
    </NestContext.Provider>
  );
}

/** The wired-up services: shelf, digest, contact, clock. */
export function useNest(): Nest {
  const nest = useContext(NestContext);
  if (!nest) throw new Error("useNest needs a NestProvider above it");
  return nest;
}

/** Language and theme, plus the Localizer for the current language. */
export function usePreferences(): Preferences {
  const preferences = useContext(PreferencesContext);
  if (!preferences) throw new Error("usePreferences needs a NestProvider above it");
  return preferences;
}

export function useLocalizer(): Localizer {
  return usePreferences().localizer;
}
