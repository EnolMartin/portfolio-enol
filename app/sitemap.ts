import type { MetadataRoute } from "next";
import { languageAlternates, locales, sections, urlFor } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    {
      url: urlFor(locale),
      alternates: { languages: languageAlternates() },
    },
    ...sections.map((section) => ({
      url: urlFor(locale, section),
      alternates: { languages: languageAlternates(section) },
    })),
  ]);
}
