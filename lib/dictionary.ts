// Rompe la compilación si un componente de cliente llega hasta aquí, en vez
// de arrastrar los textos al bundle en silencio.
import "server-only";

import type { Dictionary } from "@/content/dictionaries/es";
import type { Locale } from "./routes";

// Un import dinámico por idioma, y no los dos estáticos: así cada diccionario
// queda en su propio módulo y el que no pide la ruta no se evalúa. Hoy las
// páginas se prerenderizan y los textos no salen del servidor, de modo que al
// cliente no llega ninguno; esto es lo que impide que deje de ser cierto el día
// que un componente de cliente necesite textos y se lleve los dos idiomas.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("@/content/dictionaries/es").then((modulo) => modulo.es),
  en: () => import("@/content/dictionaries/en").then((modulo) => modulo.en),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
