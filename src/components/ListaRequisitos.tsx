// ============================================================
// LA LISTA DE REQUISITOS + BOTON DE PDF
// Muestra los puntitos de la lista con animacion (aparecen
// de a uno, como fichas de domino) y abajo el boton azul
// para descargar el PDF.
// ============================================================

import { descargarPDF } from "@/lib/generarPdf";

// Animacion de entrada: cada item espera un poquito mas que
// el anterior, asi parece que van cayendo en cascada.
function estiloCascada(indice: number, paso = 110) {
  return {
    animation: "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
    animationDelay: `${indice * paso}ms`,
  } as React.CSSProperties;
}

export function ListaRequisitos({
  titulo,
  items,
  leyenda,
  tituloPDF,
}: {
  titulo?: string;
  items: string[];
  leyenda?: string;
  tituloPDF: string; // como se va a llamar el titulo dentro del PDF
}) {
  return (
    <>
      {/* Leyenda en cursiva si el menu trae una (ej: "hasta los 21 años...") */}
      {leyenda && (
        <p
          className="text-center font-bold italic text-[#0e3a5f] text-[11px] tracking-wide mt-2 mb-2 opacity-0"
          style={{ animation: "staggerIn 0.5s forwards" }}
        >
          {leyenda}
        </p>
      )}

      {/* Si es un menu simple, mostramos su mini-titulo "REQUISITOS:" */}
      {titulo && (
        <p className="text-xs font-bold tracking-widest text-[#0a2a52] mb-3">
          {titulo}
        </p>
      )}

      {/* La listita de requisitos */}
      <ul className="flex flex-col gap-2.5">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start text-[12.5px] leading-snug font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 opacity-0"
            style={estiloCascada(idx)}
          >
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p
        className="text-[11px] text-slate-500 text-center mt-3 opacity-0"
        style={estiloCascada(items.length)}
      >
        Presentar documentación en sede central
      </p>

      {/* El boton azul que arma y descarga el PDF */}
      <button
        type="button"
        onClick={() =>
          descargarPDF({ titulo: tituloPDF, items, leyenda })
        }
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#0e3a5f] hover:bg-[#123a6b] active:scale-[0.99] text-white text-[12px] font-bold py-3 shadow-md transition-all border border-[#0e3a5f] opacity-0"
        style={estiloCascada(items.length + 1)}
      >
        DESCARGAR PDF
      </button>
    </>
  );
}
