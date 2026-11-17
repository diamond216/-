import type { Metadata } from "next";
import "@fontsource-variable/anuphan";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/mali/500.css";
import "@fontsource/mali/700.css";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/jetbrains-mono";
import { NestProvider } from "@/components/providers/NestProvider";
import { en } from "@/services/i18n/en";
import "./globals.css";
import "./v2.css";

export const metadata: Metadata = {
  title: en["meta.title"],
  description: en["meta.description"],
};

// Applies the saved theme and language before first paint, so night visitors don't get a flash of paper.
const restorePreferences = `try{var s=localStorage,q=new URLSearchParams(location.search),t=q.get("theme")||s.getItem("hamster-nest:theme"),l=q.get("lang")||s.getItem("hamster-nest:lang");if(t==="night")document.documentElement.dataset.theme="night";if(l==="th")document.documentElement.lang="th";if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion-ok")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: restorePreferences }} />
      </head>
      <body>
        <NestProvider>{children}</NestProvider>
      </body>
    </html>
  );
}
