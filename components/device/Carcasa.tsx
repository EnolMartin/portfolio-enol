import type { ReactNode } from "react";

// La carcasa no puede llevar aria-hidden: envuelve al contenido real. Lo que
// se oculta es cada pieza decorativa, que ni tiene texto ni tiene equivalente
// que contar. Para un lector de pantalla aquí no hay más que el children.
export function Carcasa({ children }: { children: ReactNode }) {
  return (
    <div className="aparato-encuadre">
      <div className="aparato">
        <div className="aparato-mesa" aria-hidden="true" />
        <div className="aparato-pantalla crt-superficie">{children}</div>
        <div className="aparato-tornillos" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="aparato-rejilla" aria-hidden="true" />
        <div className="aparato-led" aria-hidden="true" />
        <div className="aparato-derrame" aria-hidden="true" />
      </div>
    </div>
  );
}
