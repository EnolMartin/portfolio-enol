import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import {
  isLocale,
  languageAlternates,
  locales,
  pathFor,
  sections,
  urlFor,
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

  const { portada } = await getDictionary(locale);

  // Sin title: el default del layout ya es el de la portada, y repetirlo aquí
  // lo pasaría por la plantilla y duplicaría el nombre.
  return {
    description: portada.descripcion,
    alternates: {
      canonical: urlFor(locale),
      languages: languageAlternates(),
    },
  };
}

export default async function Portada({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const textos = await getDictionary(locale);

  return (
    <main>
      <h1>{textos.portada.nombre}</h1>
      <p>{textos.portada.rol}</p>
      <p>{textos.portada.entrada}</p>
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section}>
              <Link href={pathFor(locale, section)}>
                {textos.secciones[section].nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
