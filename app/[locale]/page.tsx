import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isLocale,
  languageAlternates,
  locales,
  pathFor,
  sections,
} from "@/lib/routes";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return {
    title: `[[FALTA: título de la portada en ${locale}]]`,
    description: `[[FALTA: descripción de la portada en ${locale}]]`,
    alternates: {
      canonical: pathFor(locale),
      languages: languageAlternates(),
    },
  };
}

// TODO: portada de verdad —nombre, rol e intro— cuando existan los
// diccionarios. Los marcadores se quedan a la vista a propósito.
export default async function Portada({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main>
      <h1>[[FALTA: nombre y rol]]</h1>
      <p>[[FALTA: párrafo de entrada]]</p>
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section}>
              <Link href={pathFor(locale, section)}>
                [[FALTA: nombre de la sección {section}]]
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
