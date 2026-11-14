# AMPF QR — Guía del proyecto (en criollo)

> Esta es la página que abre la gente al escanear el QR de la mutual.
> Es como un "Linktree": botones redondos que al tocarlos muestran requisitos,
> y cada lista se puede descargar en PDF.

## 1. ¿Qué hace? (en 30 segundos)

1. La persona escanea el QR → se abre esta página en el celu.
2. Ve botones (Afiliaciones, Subsidios...).
3. Toca uno → se abre una cajita blanca con los requisitos.
4. Si quiere, toca DESCARGAR PDF → le baja una hojita prolija con logo.

No hay login, no hay base de datos, no se guarda nada. Todo pasa en el celu.

## 2. Mapa del proyecto (dónde está cada cosa)

```
src/
  app/
    page.tsx        → la pantalla principal (los botones y las cajitas)
    layout.tsx      → el "marco" (título de la pestaña, fuente, fondo)
    globals.css     → los colores base + 2 animaciones
  data/
    menus.ts        → TODA la info que ve la gente (menús y requisitos) ⭐
  lib/
    generarPdf.ts   → la "imprenta" que arma el PDF ⭐
  components/
    Encabezado.tsx      → logo + título de arriba
    ListaRequisitos.tsx → la lista + botón DESCARGAR PDF (se reusa)
public/
  logo_nuevo_amp-sin fondo.png → el logo (se usa en pantalla y en PDF)
  qr-local.png / qr-vercel.png → fotitos de los QR
```

**Regla de oro:**

- ¿Cambiar un texto o agregar un requisito? → toca solo `src/data/menus.ts`
- ¿Cambiar cómo sale el PDF? → toca solo `src/lib/generarPdf.ts`
- ¿Cambiar cómo se ve la pantalla? → toca `src/app/page.tsx` y `src/components/`

## 3. Tecnologías (sin vueltas)

| Cosa         | Qué es                                                        |
| ------------ | ------------------------------------------------------------- |
| Next.js 16   | El "molde" de la página (App Router).                         |
| React 19     | Los bloquecitos que se abren y cierran al tocar.              |
| TypeScript   | JavaScript con cinturón de seguridad (avisa si te equivocas). |
| Tailwind v4  | Los estilos escritos rapidito con clases.                     |
| jsPDF        | La librería que dibuja el PDF en el navegador.                |
| qrcode       | Instalada pero **no se usa** en la pantalla actual.           |
| Vercel       | Donde está publicada (se sube sola al pushear a main).       |

## 4. Cómo agregar un menú nuevo (paso a paso)

En `src/data/menus.ts`, copia un bloque y cambialo. Ejemplo:

```ts
{
  id: "turismo",           // apodo único, en minúsculas y sin espacios
  titulo: "Turismo Requisitos",
  icono: "🏖️",             // el dibujito del botón
  items: [
    "FOTOCOPIA DEL DNI",
    "ULTIMO RECIBO DE SUELDO",
  ],
},
```

Si el menú lleva cajitas adentro (como Subsidios), usa `submenus:` en vez de
`items:` — mira el ejemplo de Subsidios que ya está en el archivo.

El QR **no cambia**: el QR apunta a la URL, y la URL sigue siendo la misma
aunque agregues menús. Por eso el pie dice "Agregables sin reimprimir QR".

## 5. Cómo es el PDF (para no perderse)

`descargarPDF()` hace esto, en orden:

1. Abre una hoja A4.
2. Pinta la franja azul y escribe el nombre de la mutual.
3. Intenta pegar el logo (si falla, sigue sin logo).
4. Pone el título del menú en una tarjetita.
5. Si hay leyenda, la pone en cursiva centrada.
6. Escribe los requisitos uno abajo del otro.
7. Si se llena la hoja, abre otra automáticamente.
8. Agrega el pie ("presentar en sede central...") y descarga el archivo.

El nombre del archivo sale solo: `TITULO_DEL_MENU_2026-11-14.pdf`.

## 6. Para correrlo en tu compu

```bash
npm install   # solo la primera vez
npm run dev   # abre en http://localhost:3000
npm run build # prueba que todo compila (antes de subir)
```

## 7. Historial de cambios

### 2026-11-14 — Refactor para que todo sea más claro

- La info salió de `page.tsx` → ahora vive en `src/data/menus.ts`.
  Antes había que meterse entre botones y estilos para cambiar un texto.
- La función del PDF salió de `page.tsx` → ahora vive en
  `src/lib/generarPdf.ts` y se simplificó (se sacó el manejo especial de
  paréntesis en cursiva que complicaba el código sin aportar mucho).
- La pantalla se partió en piezas chicas:
  `Encabezado` (logo+título) y `ListaRequisitos` (lista+botón PDF).
  `page.tsx` quedó como "armado" nomás: botones + cajitas.
- Se quitó el símbolo `⋮` duplicado del botón (quedó solo la flecha `▾`).
- Todo comentado en criollo, parte por parte.
- Se creó este archivo `GUIA_PROYECTO.md` para registrar todo.
- Verificado con `tsc --noEmit` (sin errores de tipos).
