import { NextResponse, type NextRequest } from "next/server";
import { isLocale, type Locale } from "@/lib/routes";

const PREDETERMINADO: Locale = "es";

// Solo la raíz. El resto de rutas ya llevan el idioma en el camino y salen
// prerenderizadas, así que hacerlas pasar por aquí sería peaje sin trabajo.
export const config = { matcher: "/" };

function localePreferido(cabecera: string | null): Locale {
  if (!cabecera) return PREDETERMINADO;

  const preferencias = cabecera
    .split(",")
    .map((parte) => {
      const [etiqueta, ...parametros] = parte.trim().split(";");
      // El nombre del parámetro no distingue mayúsculas (RFC 9110 12.4.2):
      // con "Q=" el peso se ignoraba y un "en;Q=0" acababa redirigiendo al
      // inglés que el cliente rechazaba.
      const calidad = parametros
        .map((p) => p.trim())
        .find((p) => p.toLowerCase().startsWith("q="));
      return {
        base: (etiqueta ?? "").trim().toLowerCase().split("-")[0] ?? "",
        peso: calidad ? Number.parseFloat(calidad.slice(2)) : 1,
      };
    })
    .filter((p) => p.base !== "" && !Number.isNaN(p.peso) && p.peso > 0)
    .sort((a, b) => b.peso - a.peso);

  for (const { base } of preferencias) {
    if (isLocale(base)) return base;
  }

  return PREDETERMINADO;
}

export function middleware(request: NextRequest) {
  const locale = localePreferido(request.headers.get("accept-language"));
  const respuesta = NextResponse.redirect(new URL(`/${locale}`, request.url));

  // Temporal y no permanente: la respuesta depende de quién pregunte, y un 308
  // lo dejaría cacheado en el navegador para siempre en el idioma del primer día.
  // El Vary evita lo mismo en cachés compartidas.
  respuesta.headers.set("Vary", "Accept-Language");
  return respuesta;
}
