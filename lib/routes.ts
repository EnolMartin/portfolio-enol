export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const sections = [
  "sobreMi",
  "proyectos",
  "trayectoria",
  "contacto",
] as const;
export type Section = (typeof sections)[number];

// El segmento va traducido y no prefijado: /en/proyectos delataría que el
// inglés es una capa puesta encima del español.
const slugs: Record<Section, Record<Locale, string>> = {
  sobreMi: { es: "sobre-mi", en: "about" },
  proyectos: { es: "proyectos", en: "projects" },
  trayectoria: { es: "trayectoria", en: "experience" },
  contacto: { es: "contacto", en: "contact" },
};

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

// Devuelve undefined en lugar de lanzar: quien resuelve la ruta decide si eso
// es un 404 o un enlace que no llega a pintarse.
export function sectionForSlug(
  locale: Locale,
  slug: string,
): Section | undefined {
  return sections.find((section) => slugs[section][locale] === slug);
}

export function slugFor(locale: Locale, section: Section): string {
  return slugs[section][locale];
}

export function pathFor(locale: Locale, section?: Section): string {
  return section ? `/${locale}/${slugFor(locale, section)}` : `/${locale}`;
}

export const sitio = "https://enolmartin.dev";

export function urlFor(locale: Locale, section?: Section): string {
  return `${sitio}${pathFor(locale, section)}`;
}

// Absolutas y no relativas aunque metadataBase las resolvería: el sitemap las
// necesita absolutas de todas formas, y con una sola forma de escribirlas no
// hay dos sitios donde equivocarse.
export function languageAlternates(section?: Section) {
  return {
    es: urlFor("es", section),
    en: urlFor("en", section),
    // Español por defecto, igual que el reparto de la raíz por Accept-Language.
    "x-default": urlFor("es", section),
  };
}
