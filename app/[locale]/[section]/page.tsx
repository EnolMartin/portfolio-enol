import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import {
  isLocale,
  languageAlternates,
  locales,
  sectionForSlug,
  sections,
  slugFor,
  urlFor,
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

  const { secciones } = await getDictionary(locale);

  return {
    title: secciones[section].titulo,
    description: secciones[section].descripcion,
    alternates: {
      canonical: urlFor(locale, section),
      languages: languageAlternates(section),
    },
  };
}

// TODO: cada sección monta su componente de components/sections en cuanto haya
// maquetación; el encabezado es lo único que comparten las cuatro.
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

  const { secciones } = await getDictionary(locale);

  return (
    <main>
      <h1>{secciones[section].encabezado}</h1>
    </main>
  );
}
