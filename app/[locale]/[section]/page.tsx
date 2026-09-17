import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isLocale,
  languageAlternates,
  locales,
  pathFor,
  sectionForSlug,
  sections,
  slugFor,
} from "@/lib/routes";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    sections.map((section) => ({ locale, section: slugFor(locale, section) })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}): Promise<Metadata> {
  const { locale, section: slug } = await params;
  if (!isLocale(locale)) notFound();

  const section = sectionForSlug(locale, slug);
  if (!section) notFound();

  return {
    title: `[[FALTA: título de ${section} en ${locale}]]`,
    description: `[[FALTA: descripción de ${section} en ${locale}]]`,
    alternates: {
      canonical: pathFor(locale, section),
      languages: languageAlternates(section),
    },
  };
}

// TODO: cada sección monta su componente de components/sections en cuanto
// existan los diccionarios. Hasta entonces, marcadores a la vista.
export default async function PaginaDeSeccion({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section: slug } = await params;
  if (!isLocale(locale)) notFound();

  // El slug que no está en el mapa no tiene sección que servir, y ese hueco
  // del tipo es el 404: no hace falta comprobarlo dos veces.
  const section = sectionForSlug(locale, slug);
  if (!section) notFound();

  return (
    <main>
      <h1>[[FALTA: encabezado de {section}]]</h1>
    </main>
  );
}
