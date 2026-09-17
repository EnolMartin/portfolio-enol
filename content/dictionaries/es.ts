// Los huecos llevan marcador y no string vacío: un "" se renderiza sin dejar
// rastro y se publica sin que nadie lo note, mientras que el marcador se ve en
// la pantalla y en el <title>, y la auditoría lo trata como bloqueo.
//
// Sin `as const`: congelaría cada valor en su tipo literal y en.ts tendría que
// repetir el español palabra por palabra para compilar.
import "server-only";

export const es = {
  portada: {
    nombre: "[[FALTA: nombre, en español]]",
    rol: "[[FALTA: rol, en español]]",
    entrada: "[[FALTA: párrafo de entrada, en español]]",
    titulo: "[[FALTA: title de la portada, en español]]",
    descripcion: "[[FALTA: meta description de la portada, en español]]",
  },
  secciones: {
    sobreMi: {
      nombre: "[[FALTA: Sobre mí en la navegación, en español]]",
      encabezado: "[[FALTA: encabezado de Sobre mí, en español]]",
      titulo: "[[FALTA: title de Sobre mí sin el sufijo, en español]]",
      descripcion: "[[FALTA: meta description de Sobre mí, en español]]",
    },
    proyectos: {
      nombre: "[[FALTA: Proyectos en la navegación, en español]]",
      encabezado: "[[FALTA: encabezado de Proyectos, en español]]",
      titulo: "[[FALTA: title de Proyectos sin el sufijo, en español]]",
      descripcion: "[[FALTA: meta description de Proyectos, en español]]",
    },
    trayectoria: {
      nombre: "[[FALTA: Trayectoria en la navegación, en español]]",
      encabezado: "[[FALTA: encabezado de Trayectoria, en español]]",
      titulo: "[[FALTA: title de Trayectoria sin el sufijo, en español]]",
      descripcion: "[[FALTA: meta description de Trayectoria, en español]]",
    },
    contacto: {
      nombre: "[[FALTA: Contacto en la navegación, en español]]",
      encabezado: "[[FALTA: encabezado de Contacto, en español]]",
      titulo: "[[FALTA: title de Contacto sin el sufijo, en español]]",
      descripcion: "[[FALTA: meta description de Contacto, en español]]",
    },
  },
};

export type Dictionary = typeof es;
