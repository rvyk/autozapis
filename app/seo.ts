import type { Metadata } from "next";

export const siteName = "Prawo Jazdy Józef Majkut";
export const siteDescription =
  "Nowoczesny OSK w Grodzisku Górnym, Grodzisku Dolnym, Żołyni i Leżajsku. Kurs prawa jazdy kat. B, jazdy, wykłady i zapisy online.";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export function createPageMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  const canonical = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
