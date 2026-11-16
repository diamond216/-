"use client";

import { useEffect } from "react";

/** Keeps the browser tab's title in the visitor's language. The build writes the English one into the HTML. */
export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
