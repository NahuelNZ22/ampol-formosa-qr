"use client";

// ============================================================
// LA PANTALLA PRINCIPAL (el "Linktree" de la mutual)
// Piensalo asi:
//   1. Arriba va el Encabezado (logo + titulo)
//   2. En el medio, un boton redondo por cada menu
//   3. Al tocar un boton, se abre su cajita blanca con la info
//   4. Si el menu tiene cajitas adentro (submenus), se abren igual
// Los textos viven en src/data/menus.ts y el PDF en src/lib/generarPdf.ts.
// Aqui solo esta el "armado" de la pantalla.
// ============================================================

import { useState } from "react";
import { menus } from "@/data/menus";
import { Encabezado } from "@/components/Encabezado";
import { ListaRequisitos } from "@/components/ListaRequisitos";

export default function Home() {
  // Que menu grande esta abierto (solo uno a la vez, o ninguno)
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  // Que cajita de adentro esta abierta (para Subsidios)
  const [subAbierto, setSubAbierto] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0e3a5f] via-[#0a2440] to-[#020b18] flex flex-col items-center">
      <div className="w-full max-w-[430px] flex flex-col items-center px-5 pb-10 pt-8">
        <Encabezado />

        {/* Los botones redondos, uno por menu */}
        <div className="w-full flex flex-col gap-3 mt-6">
          {menus.map((menu) => {
            const abierto = menuAbierto === menu.id;
            return (
              <div key={menu.id} className="w-full">
                {/* El boton en si: icono + titulo + flechita */}
                <button
                  type="button"
                  onClick={() => setMenuAbierto(abierto ? null : menu.id)}
                  className={`w-full flex items-center justify-between rounded-full border bg-white/15 backdrop-blur-xl px-2 py-2.5 pr-3 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all hover:bg-white/20 active:scale-[0.98] cursor-pointer ${abierto ? "bg-white/25 border-white" : "border-white/50"}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-[#020b18] text-white flex items-center justify-center text-[15px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.35)] border border-white/20">
                      {menu.icono}
                    </span>
                    <span className="text-[13px] font-bold tracking-wide text-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                      {menu.titulo}
                    </span>
                  </span>
                  <span
                    className={`text-xs transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {/* Textito gris que invita a tocar */}
                {!abierto && (
                  <p className="text-center text-white/45 text-[11px] font-medium tracking-wide mt-1.5 italic uppercase">
                    presione para desplegar
                  </p>
                )}

                {/* La cajita blanca que se abre al tocar */}
                {abierto && (
                  <div
                    className="mt-3 overflow-hidden"
                    style={{
                      animation:
                        "accordionIn 0.7s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <div className="rounded-[22px] bg-white text-slate-800 p-4 shadow-xl border border-white/50">
                      {/* CASO 1: menu simple (Afiliaciones) */}
                      {menu.items && (
                        <ListaRequisitos
                          titulo="REQUISITOS:"
                          items={menu.items}
                          tituloPDF={menu.titulo}
                        />
                      )}

                      {/* CASO 2: menu con cajitas adentro (Subsidios) */}
                      {menu.submenus && (
                        <div className="flex flex-col gap-3">
                          {menu.submenus.map((sub, sIdx) => {
                            const clave = `${menu.id}-${sub.id}`;
                            const subEstaAbierto = subAbierto === clave;
                            return (
                              <div
                                key={sub.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden opacity-0"
                                style={{
                                  animation:
                                    "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
                                  animationDelay: `${sIdx * 90}ms`,
                                }}
                              >
                                {/* El boton de la cajita */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSubAbierto(
                                      subEstaAbierto ? null : clave
                                    )
                                  }
                                  className={`w-full flex items-center justify-between px-3 py-3 text-left transition-colors ${subEstaAbierto ? "bg-white" : "bg-slate-50 hover:bg-white"}`}
                                >
                                  <span className="text-[12px] font-bold text-[#0e3a5f] leading-tight">
                                    {sub.titulo}
                                  </span>
                                  <span
                                    className={`text-[#0e3a5f] text-xs transition-transform duration-200 ${subEstaAbierto ? "rotate-180" : ""}`}
                                  >
                                    ▾
                                  </span>
                                </button>

                                {!subEstaAbierto && (
                                  <p className="text-center text-slate-500/60 text-[11px] font-medium tracking-wide -mt-1 mb-1 italic uppercase">
                                    presione para desplegar
                                  </p>
                                )}

                                {/* Lo de adentro de la cajita */}
                                {subEstaAbierto && (
                                  <div
                                    className="px-3 pb-3 pt-1 bg-white border-t border-slate-100"
                                    style={{
                                      animation:
                                        "accordionIn 0.5s cubic-bezier(0.22,1,0.36,1)",
                                    }}
                                  >
                                    <ListaRequisitos
                                      items={sub.items}
                                      leyenda={sub.leyenda}
                                      tituloPDF={`${menu.titulo} - ${sub.titulo}`}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pie: aviso de que se pueden sumar mas menus sin cambiar el QR */}
          <p className="text-center text-white/50 text-xs mt-4">
            + Próximamente más menús. Agregables sin reimprimir QR.
          </p>
          <footer className="text-center text-white/50 text-xs mt-4">
            © 2026 NorthSystem. Todos los derechos reservados.
          </footer>
        </div>
      </div>
    </div>
  );
}
