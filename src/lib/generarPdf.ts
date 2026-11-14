// ============================================================
// LA "IMPRENTA" DE LA PAGINA
// Esta funcion arma el PDF que la gente se descarga.
// Piensalo asi: agarra una hoja blanca, le pega el logo,
// le escribe el titulo y la lista, y la entrega lista.
// ============================================================

import jsPDF from "jspdf";

// Lo que necesita para armar la hoja: titulo, lista y leyenda opcional.
type DatosPDF = {
  titulo: string;
  items: string[];
  leyenda?: string;
};

export async function descargarPDF(menu: DatosPDF) {
  // 1) Abrimos una hoja A4 nueva (medida en milimetros)
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const anchoHoja = doc.internal.pageSize.getWidth();
  const altoHoja = doc.internal.pageSize.getHeight();
  const margen = 20;

  // 2) Pintamos la franja azul de arriba (el encabezado)
  doc.setFillColor(14, 58, 95); // ese azul oscuro de la mutual
  doc.rect(0, 0, anchoHoja, 38, "F");

  // 3) Pegamos el logo arriba a la izquierda (si lo encuentra)
  try {
    const res = await fetch(encodeURI("/logo_nuevo_amp-sin fondo.png"));
    if (res.ok) {
      const blob = await res.blob();
      const base64: string = await new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onloadend = () => resolve(lector.result as string);
        lector.onerror = reject;
        lector.readAsDataURL(blob);
      });
      doc.addImage(base64, "PNG", margen - 2, 8, 22, 22);
    }
  } catch {
    // Si el logo falla, seguimos igual: la hoja sale sin logo pero sale
  }

  // 4) Escribimos el nombre de la institucion en blanco
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("ASOCIACION MUTUAL POLICIA DE FORMOSA", anchoHoja / 2, 16, {
    align: "center",
  });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("INFORMACION PARA AFILIADOS", anchoHoja / 2, 22, {
    align: "center",
  });

  // 5) La tarjetita con el titulo del menu (ej: "SUBSIDIOS - ...")
  let y = 48; // "y" es que tan abajo vamos escribiendo
  doc.setFillColor(240, 245, 250);
  doc.setDrawColor(14, 58, 95);
  doc.roundedRect(margen - 4, y - 8, anchoHoja - margen * 2 + 8, 14, 3, 3, "FD");
  doc.setTextColor(14, 58, 95);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(menu.titulo.toUpperCase(), anchoHoja / 2, y, { align: "center" });

  // 6) Una linecita divisoria para que se vea prolijo
  y += 12;
  doc.setDrawColor(200, 210, 225);
  doc.line(margen, y, anchoHoja - margen, y);
  y += 8;

  // 7) Si tiene leyenda (el cartelito en cursiva), la ponemos
  if (menu.leyenda) {
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(9);
    doc.setTextColor(14, 58, 95);
    const lineas = doc.splitTextToSize(
      menu.leyenda.toUpperCase(),
      anchoHoja - margen * 2
    );
    doc.text(lineas, anchoHoja / 2, y, { align: "center" });
    y += lineas.length * 5 + 6;
    doc.setDrawColor(200, 210, 225);
    doc.line(margen + 20, y - 2, anchoHoja - margen - 20, y - 2);
    y += 2;
  }

  // 8) La lista de requisitos, uno abajo del otro con guioncito
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const anchoTexto = anchoHoja - margen * 2 - 6;

  for (const item of menu.items) {
    const texto = `- ${item.toUpperCase()}`;
    const lineas = doc.splitTextToSize(texto, anchoTexto);

    // Si ya estamos muy abajo, abrimos otra hoja
    if (y + lineas.length * 5.5 > altoHoja - 28) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(30, 40, 60);
    doc.setFontSize(9.5);
    doc.text(lineas, margen + 2, y + 2.5);
    y += Math.max(8, lineas.length * 5.5) + 4;
  }

  // 9) El pie: "presentar en sede central..." y la firma
  y += 4;
  doc.setDrawColor(14, 58, 95);
  doc.line(margen, y, anchoHoja - margen, y);
  y += 7;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 110, 130);
  doc.text(
    "PRESENTAR DOCUMENTACION EN SEDE CENTRAL. DOCUMENTO GENERADO DIGITALMENTE.",
    anchoHoja / 2,
    y,
    { align: "center" }
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(140, 150, 165);
  doc.text(
    "© 2026 NORTHSYSTEM — ASOCIACION MUTUAL POLICIA DE FORMOSA",
    anchoHoja / 2,
    altoHoja - 10,
    { align: "center" }
  );

  // 10) Le ponemos nombre al archivo y lo descargamos
  const nombre = `${menu.titulo.replace(/\s+/g, "_").toUpperCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(nombre);
}
