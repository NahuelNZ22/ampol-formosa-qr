"use client";

import Image from "next/image";
import { useState } from "react";

const menus = [
  {
    id: "afiliaciones",
    titulo: "Afiliaciones Requisitos",
    icono: "📄",
    items: [
      "ACTA DE CONVIVENCIA DEL REGISTRO CIVIL",
      "FOTOCOPIA DEL DNI",
      "CERTIFICACION NEGATIVA DEL ANSES",
      "CERTIFICACION NEGATIVA DE LA CAJA DE PREVISION SOCIAL",
      "CERTIFICACION NEGATIVA DE IPS",
    ],
  },
];

export default function Home() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0e3a5f] via-[#0a2440] to-[#020b18] flex flex-col items-center">
      <div className="w-full max-w-[430px] flex flex-col items-center px-5 pb-10 pt-8">

        {/* Logo AMPF - sin fondo, solo sombra esfumada */}
        <div className="flex items-center justify-center mb-5">
          <Image
            src="/logo_nuevo_amp-sin fondo.png"
            alt="Logo Asociacion Mutual Policia de Formosa"
            width={148}
            height={148}
            priority
            className="h-[148px] w-[148px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] [filter:drop-shadow(0_0_28px_rgba(0,0,0,0.35))_drop-shadow(0_2px_12px_rgba(255,255,255,0.12))]"
          />
        </div>

        {/* Título */}
        <h1 className="text-white text-center text-[22px] font-extrabold leading-tight tracking-tight">
          ASOCIACION MUTUAL POLICIA DE FORMOSA
        </h1>
        <p className="text-white/85 text-center text-[13px] mt-2 max-w-[320px] leading-snug">
          INFORMACION PARA AFILIADOS</p>
          <p className="text-white/85 text-center text-[13px] mt-2 max-w-[320px] leading-snug">
            Toca el menu para ver los requisitos de cada tramite
          </p>

        {/* Menús - Pills Linktree */}
        <div className="w-full flex flex-col gap-3 mt-6">
          {menus.map((menu) => {
            const isOpen = openId === menu.id;
            return (
              <div key={menu.id} className="w-full">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : menu.id)}
                  className={`w-full flex items-center justify-between rounded-full border bg-white/15 backdrop-blur-xl px-2 py-2.5 pr-3 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all hover:bg-white/20 active:scale-[0.98] cursor-pointer ${isOpen ? "bg-white/25 border-white" : "border-white/50"}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-[#020b18] text-white flex items-center justify-center text-[15px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.35)] border border-white/20">
                      {menu.icono}
                    </span>
                    <span className="text-[13px] font-bold tracking-wide text-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                      {menu.titulo}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className={`text-white/90 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      ⋮
                    </span>
                    <span
                      className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </span>
                </button>

                {/* Acordeón */}
                {isOpen && (
                  <div className="mt-3 animate-in fade-in duration-200">
                    <div className="rounded-[22px] bg-white text-slate-800 p-4 shadow-xl border border-white/50">
                      <p className="text-xs font-bold tracking-widest text-[#0a2a52] mb-3">
                        REQUISITOS:
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {menu.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex gap-2.5 items-start text-[12.5px] leading-snug font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                          >
                            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#1a6fb5] text-white flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-slate-500 text-center mt-3">
                        Presentar documentación en sede central
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Placeholder para futuros menús */}
          <p className="text-center text-white/50 text-xs mt-4">
            + Próximamente más menús. Agregables sin reimprimir QR.
          </p>
        </div>
      </div>
    </div>
  );
}
