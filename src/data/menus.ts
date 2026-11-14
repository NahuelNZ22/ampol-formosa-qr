// ============================================================
// AQUI VIVE LA INFORMACION DE LA PAGINA
// Piensalo como el "menu del restaurante": aqui se escribe
// que opciones ve la gente, nada mas. Si quieres agregar o
// cambiar un requisito, SOLO toca este archivo.
// ============================================================

// Un SubMenu es una cajita dentro de un menu grande.
// Ejemplo: dentro de "Subsidios" hay "Fallecimiento de hijo", etc.
export type SubMenu = {
  id: string; // apodo corto para reconocerlo (no se muestra)
  titulo: string; // lo que ve la gente
  leyenda?: string; // cartelito chiquito opcional debajo del titulo
  items: string[]; // la lista de requisitos
};

// Un Menu es un boton grande de la pantalla principal.
export type Menu = {
  id: string;
  titulo: string;
  icono: string; // el dibujito (emoji) que sale al lado
  items?: string[]; // lista simple (como Afiliaciones)
  submenus?: SubMenu[]; // o lista con cajitas adentro (como Subsidios)
};

// ------------------------------------------------------------
// ESTA ES TODA LA INFO QUE VE LA GENTE.
// Para agregar un menu nuevo, copia un bloque y cambiale el texto.
// Para agregar un requisito, agrega una linea con comillas.
// ------------------------------------------------------------
export const menus: Menu[] = [
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
        leyenda:
          "HASTA LOS 21 AÑOS DE EDAD Y DISCAPACITADOS SIN LIMITE DE EDAD",
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
        items: [
          "ACTA DE DEFUNCION CERTIFICADA",
          "OTROS REQUISITOS PROXIMAMENTE...",
        ],
      },
    ],
  },
];
