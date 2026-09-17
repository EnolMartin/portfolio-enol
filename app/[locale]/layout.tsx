import type { Metadata } from "next";
import { Archivo_Black, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, sitio } from "@/lib/routes";
import "../globals.css";

// Peso estático en vez de la variable: el eje wght costaría el doble de bytes
// y aquí nadie interpola peso, porque solo se animan transform y opacity.
// El subset latin ya trae ñ, tildes, ¿ y ¡: latin-ext sobra y pesa.
// Sin fallback métrico: next/font lo calcula contra Arial, que es proporcional
// y gana siempre a la pila monoespaciada del token. El respaldo natural del
// sistema ya avanza como Plex Mono, así que el ajuste solo hacía daño.
const cuerpo = IBM_Plex_Mono({
  variable: "--fuente-cuerpo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

const titular = Archivo_Black({
  variable: "--fuente-titular",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Nada se sirve en petición: lo que no salga de un generateStaticParams es un
// 404, y eso cubre tanto un idioma inventado como una sección fuera del mapa.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Inalcanzable con dynamicParams en false; está para estrechar el tipo.
  if (!isLocale(locale)) notFound();

  const { portada } = await getDictionary(locale);

  return {
    metadataBase: new URL(sitio),
    title: {
      // Las secciones aportan solo su parte y el sufijo se escribe una vez.
      // La portada no declara título: hereda este default, que ya va completo.
      template: `%s — ${portada.nombre}`,
      default: portada.titulo,
    },
  };
}

// Este es el layout raíz: no hay app/layout.tsx porque el <html> tiene que
// nacer ya con el idioma de la ruta, y un layout por encima de [locale] no
// recibe el parámetro.
export default async function LayoutRaiz({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${cuerpo.variable} ${titular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
