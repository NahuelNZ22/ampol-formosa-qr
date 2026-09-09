"use client";

import Image from "next/image";
import { useState } from "react";
import jsPDF from "jspdf";

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

async function downloadMenuPDF(menu: { titulo: string; items: string[] }) {
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

  // Requisitos numerados - todo en mayúscula
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 50, 70);
  menu.items.forEach((item, idx) => {
    const text = item.toUpperCase();
    const textMaxW = pageW - margin * 2 - 12;

    // Círculo numerado
    const circleY = y + 1.2;
    doc.setFillColor(26, 111, 181);
    doc.circle(margin + 3, circleY, 3.5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(String(idx + 1), margin + 3, circleY + 1, { align: "center" });

    // Texto
    doc.setTextColor(30, 40, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(text, textMaxW);
    doc.text(lines, margin + 10, y + 2.5);

    const h = Math.max(8, lines.length * 5.5);
    y += h + 4;

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

                {/* Acordeón - despliegue suave con stagger (más lento) */}
                {isOpen && (
                  <div
                    className="mt-3 overflow-hidden"
                    style={{ animation: "accordionIn 0.7s cubic-bezier(0.22,1,0.36,1)" }}
                  >
                    <div className="rounded-[22px] bg-white text-slate-800 p-4 shadow-xl border border-white/50">
                      <p className="text-xs font-bold tracking-widest text-[#0a2a52] mb-3">
                        REQUISITOS:
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {menu.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex gap-2.5 items-start text-[12.5px] leading-snug font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 opacity-0"
                            style={{
                              animation: "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
                              animationDelay: `${idx * 110}ms`,
                            }}
                          >
                            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#1a6fb5] text-white flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
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
                        onClick={() => downloadMenuPDF(menu)}
                        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#0e3a5f] hover:bg-[#123a6b] active:scale-[0.99] text-white text-[12px] font-bold py-3 shadow-md transition-all border border-[#0e3a5f] opacity-0"
                        style={{
                          animation: "staggerIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
                          animationDelay: `${(menu.items.length + 1) * 110}ms`,
                        }}
                      >
                        DESCARGAR PDF
                      </button>
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
