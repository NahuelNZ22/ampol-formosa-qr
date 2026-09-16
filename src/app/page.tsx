"use client";

import Image from "next/image";
import { useState } from "react";
import jsPDF from "jspdf";

type SubMenu = { id: string; titulo: string; leyenda?: string; items: string[] };
type Menu = { id: string; titulo: string; icono: string; items?: string[]; submenus?: SubMenu[] };

const menus: Menu[] = [
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
  {
    id: "subsidios",
    titulo: "Subsidios Requisitos",
    icono: "💰",
    submenus: [
      {
        id: "hijo",
        titulo: "FALLECIMIENTO DE HIJO/A",
        leyenda: "HASTA LOS 21 AÑOS DE EDAD Y DISCAPACITADOS SIN LIMITE DE EDAD",
        items: [
          "ACTA DE DEFUNCION CERTIFICADA",
          "ACTA DE NACIMIENTO CERTIFICADA DE HIJO/A FALLECIDO/A",
          "ULTIMO RECIBO DE SUELDO DEL SOCIO TITULAR",
          "ULTIMO ESTADO DE CUENTA AMPF",
          "CUIL, CONSTANCIA DE CBU Y BANCO DEL SOCIO TITULAR",
        ],
      },
      {
        id: "suegra",
        titulo: "FALLECIMIENTO DE SUEGRA O SUEGRO",
        items: [
          "ACTA DE DEFUNCION CERTIFICADA",
          "ACTA DE MATRIMONIO CERTIFICADA DEL SOCIO TITULAR",
          "ACTA DE NACIMIENTO CERTIFICADA DEL/LA CONYUGUE (DONDE SE ACREDITE EL VINCULO)",
          "FOTOCOPIA DEL ULTIMO RECIBO DE SUELDO DEL SOCIO TITULAR",
          "CUIL, CBU Y BANCO DEL SOCIO TITULAR",
          "ULTIMO ESTADO DE CUENTA AMPF",
        ],
      },
      {
        id: "padre",
        titulo: "FALLECIMIENTO DE PADRE O MADRE",
        items: ["INFORMACION A CONFIRMAR - PASAME EL DETALLE PARA ESTE SUBMENU"],
      },
    ],
  },
];

async function downloadMenuPDF(menu: { titulo: string; items: string[]; leyenda?: string }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Fondo header formal
  doc.setFillColor(14, 58, 95); // #0e3a5f
  doc.rect(0, 0, pageW, 38, "F");

  // Logo esquina superior izquierda - chico a medio
  try {
    const logoUrl = encodeURI("/logo_nuevo_amp-sin fondo.png");
    const res = await fetch(logoUrl);
    if (res.ok) {
      const blob = await res.blob();
      const base64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      // 18mm x 18mm centrado vertical en header
      doc.addImage(base64, "PNG", margin - 2, 8, 22, 22);
    }
  } catch {}

  // Título institución - todo en mayúscula
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("ASOCIACION MUTUAL POLICIA DE FORMOSA", pageW / 2, 16, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("INFORMACION PARA AFILIADOS", pageW / 2, 22, { align: "center" });

  // Card título menú
  let y = 48;
  doc.setFillColor(240, 245, 250);
  doc.setDrawColor(14, 58, 95);
  doc.roundedRect(margin - 4, y - 8, pageW - margin * 2 + 8, 14, 3, 3, "FD");
  doc.setTextColor(14, 58, 95);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(menu.titulo.toUpperCase(), pageW / 2, y, { align: "center" });

  y += 12;
  doc.setDrawColor(200, 210, 225);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Leyenda en negrita y cursiva si existe
  if (menu.leyenda) {
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(9);
    doc.setTextColor(14, 58, 95);
    const leyLines = doc.splitTextToSize(menu.leyenda.toUpperCase(), pageW - margin * 2);
    doc.text(leyLines, pageW / 2, y, { align: "center" });
    y += leyLines.length * 5 + 6;
    doc.setDrawColor(200, 210, 225);
    doc.line(margin + 20, y - 2, pageW - margin - 20, y - 2);
    y += 2;
  }

  // Requisitos - sin números, todo en mayúscula, paréntesis en cursiva
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 50, 70);
  menu.items.forEach((item) => {
    const upper = item.toUpperCase();
    const parenMatch = upper.match(/^(.*?)(\(.*?\))(.*)$/);
    const hasParen = !!parenMatch;
    const textMaxW = pageW - margin * 2 - 6;

    doc.setTextColor(30, 40, 60);
    doc.setFontSize(9.5);

    if (!hasParen) {
      const text = `- ${upper}`;
      const lines = doc.splitTextToSize(text, textMaxW);
      doc.text(lines, margin + 2, y + 2.5);
      const h = Math.max(8, lines.length * 5.5);
      y += h + 4;
    } else {
      // Render con paréntesis en cursiva
      const before = `- ${parenMatch![1].trim()} `;
      const paren = parenMatch![2];
      const after = parenMatch![3];
      const full = `${before}${paren}${after}`;
      const lines = doc.splitTextToSize(full, textMaxW);
      // Aproximación: escribir todo en normal y luego sobreescribir paréntesis en italic no es trivial sin medir
      // Solución simple: escribir línea completa y poner paréntesis en italic via split
      // Para mantener prolijidad, usamos una sola línea con estilo mixto manual si cabe en una línea
      if (lines.length === 1) {
        const beforeW = doc.getTextWidth(before);
        doc.setFont("helvetica", "normal");
        doc.text(before, margin + 2, y + 2.5);
        doc.setFont("helvetica", "italic");
        doc.text(paren, margin + 2 + beforeW, y + 2.5);
        const parenW = doc.getTextWidth(paren);
        doc.setFont("helvetica", "normal");
        doc.text(after, margin + 2 + beforeW + parenW, y + 2.5);
        y += 8 + 4;
      } else {
        const text = `- ${upper}`;
        const mLines = doc.splitTextToSize(text, textMaxW);
        // Para multilinea, simplificar: todo en normal (evitar desalineo)
        doc.setFont("helvetica", "normal");
        doc.text(mLines, margin + 2, y + 2.5);
        const h = Math.max(8, mLines.length * 5.5);
        y += h + 4;
      }
      // ya se incrementó y dentro del hasParen, no duplicar
      if (hasParen) return;
    }

    const h2 = Math.max(8, doc.splitTextToSize(`- ${upper}`, textMaxW).length * 5.5);
    y += h2 + 4;

    // Si se acerca al final, nueva página
    if (y > pageH - 28) {
      doc.addPage();
      y = 20;
    }
  });

  y += 4;
  doc.setDrawColor(14, 58, 95);
  doc.line(margin, y, pageW - margin, y);
  y += 7;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 110, 130);
  doc.text("PRESENTAR DOCUMENTACION EN SEDE CENTRAL. DOCUMENTO GENERADO DIGITALMENTE.".toUpperCase(), pageW / 2, y, { align: "center" });

  // Footer - todo en mayúscula, sin fecha
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(140, 150, 165);
  doc.text("© 2026 NORTHSYSTEM — ASOCIACION MUTUAL POLICIA DE FORMOSA", pageW / 2, pageH - 10, { align: "center" });

  const fileName = `${menu.titulo.replace(/\s+/g, "_").toUpperCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}

export default function Home() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [openSubId, setOpenSubId] = useState<string | null>(null);

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
          INFORMACION PARA AFILIADOS
        </h1>
        <p className="text-white/85 text-center text-[13px] mt-2 max-w-[320px] leading-snug">
          TOCA EL MENU PARA VER LA INFORMACION</p>
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
                {!isOpen && (
                  <p className="text-center text-white/45 text-[11px] font-medium tracking-wide mt-1.5 italic uppercase">presione para desplegar</p>
                )}

                {/* Acordeón - soporte flat items o submenús */}
                {isOpen && (
                  <div
                    className="mt-3 overflow-hidden"
                    style={{ animation: "accordionIn 0.7s cubic-bezier(0.22,1,0.36,1)" }}
                  >
                    <div className="rounded-[22px] bg-white text-slate-800 p-4 shadow-xl border border-white/50">
                      {/* Caso flat: Afiliaciones */}
                      {menu.items && (
                        <>
                          <p className="text-xs font-bold tracking-widest text-[#0a2a52] mb-3">REQUISITOS:</p>
                          <ul className="flex flex-col gap-2.5">
                            {menu.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-[12.5px] leading-snug font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 opacity-0"
                                style={{
                                  animation: "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
                                  animationDelay: `${idx * 110}ms`,
                                }}
                              >
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          <p
                            className="text-[11px] text-slate-500 text-center mt-3 opacity-0"
                            style={{
                              animation: "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
                              animationDelay: `${menu.items.length * 110}ms`,
                            }}
                          >
                            Presentar documentación en sede central
                          </p>
                          <button
                            type="button"
                            onClick={() => downloadMenuPDF(menu as { titulo: string; items: string[] })}
                            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#0e3a5f] hover:bg-[#123a6b] active:scale-[0.99] text-white text-[12px] font-bold py-3 shadow-md transition-all border border-[#0e3a5f] opacity-0"
                            style={{
                              animation: "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
                              animationDelay: `${(menu.items.length + 1) * 110}ms`,
                            }}
                          >
                            DESCARGAR PDF
                          </button>
                        </>
                      )}

                      {/* Caso con submenús: Subsidios */}
                      {menu.submenus && (
                        <div className="flex flex-col gap-3">
                          {menu.submenus.map((sub, sIdx) => {
                            const isSubOpen = openSubId === `${menu.id}-${sub.id}`;
                            return (
                              <div
                                key={sub.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden opacity-0"
                                style={{
                                  animation: "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
                                  animationDelay: `${sIdx * 90}ms`,
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => setOpenSubId(isSubOpen ? null : `${menu.id}-${sub.id}`)}
                                  className={`w-full flex items-center justify-between px-3 py-3 text-left transition-colors ${isSubOpen ? "bg-white" : "bg-slate-50 hover:bg-white"}`}
                                >
                                  <span className="flex items-center gap-2.5">
                                    <span className="text-[12px] font-bold text-[#0e3a5f] leading-tight">{sub.titulo}</span>
                                  </span>
                                  <span className={`text-[#0e3a5f] text-xs transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`}>▾</span>
                                </button>
                                {!isSubOpen && (
                                  <p className="text-center text-slate-500/60 text-[11px] font-medium tracking-wide -mt-1 mb-1 italic uppercase">presione para desplegar</p>
                                )}
                                {isSubOpen && (
                                  <div className="px-3 pb-3 pt-1 bg-white border-t border-slate-100" style={{ animation: "accordionIn 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
                                    {sub.leyenda && (
                                      <p className="text-center font-bold italic text-[#0e3a5f] text-[11px] tracking-wide mt-2 mb-2 opacity-0" style={{ animation: "staggerIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards" }}>
                                        {sub.leyenda}
                                      </p>
                                    )}
                                     <ul className="flex flex-col gap-2 mt-2">
                                      {sub.items.map((it, idx) => {
                                        const m = it.match(/^(.*?)(\(.*?\))(.*)$/);
                                        const isLast = idx === sub.items.length - 1;
                                        return (
                                          <li
                                            key={idx}
                                            className={`flex items-start text-[12px] leading-snug font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 opacity-0 ${isLast ? "tracking-wide" : ""}`}
                                            style={{
                                              animation: "staggerIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
                                              animationDelay: `${idx * 90}ms`,
                                              ...(isLast ? { wordSpacing: "0.18em" } : {}),
                                            }}
                                          >
                                            <span>
                                              {m ? (
                                                <>
                                                  {m[1]}
                                                  <span className="italic">{m[2]}</span>
                                                  {m[3]}
                                                </>
                                              ) : (
                                                it
                                              )}
                                            </span>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                    <button
                                      type="button"
                                      onClick={() => downloadMenuPDF({ titulo: `${menu.titulo} - ${sub.titulo}`, items: sub.items, leyenda: sub.leyenda })}
                                      className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-[#0e3a5f] hover:bg-[#123a6b] active:scale-[0.99] text-white text-[11px] font-bold py-2.5 shadow-md transition-all border border-[#0e3a5f] opacity-0"
                                      style={{
                                        animation: "staggerIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
                                        animationDelay: `${sub.items.length * 90 + 80}ms`,
                                      }}
                                    >
                                      DESCARGAR PDF
                                    </button>
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

          {/* Placeholder para futuros menús */}
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
