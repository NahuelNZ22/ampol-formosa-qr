// ============================================================
// EL ENCABEZADO: logo + titulo
// Es lo primero que ve la gente al abrir el QR.
// Si quieres cambiar el titulo, toca aqui.
// ============================================================

import Image from "next/image";

export function Encabezado() {
  return (
    <>
      {/* El loguito de la mutual, con sombrita para que flote */}
      <div className="flex items-center justify-center mb-5">
        <Image
          src="/logo_nuevo_amp-sin fondo.png"
          alt="Logo Asociacion Mutual Policia de Formosa"
          width={148}
          height={148}
          priority
          className="h-[148px] w-[148px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
        />
      </div>

      {/* El titulo grande y el subtitulo chiquito */}
      <h1 className="text-white text-center text-[22px] font-extrabold leading-tight tracking-tight">
        INFORMACION PARA AFILIADOS
      </h1>
      <p className="text-white/85 text-center text-[13px] mt-2 max-w-[320px] leading-snug">
        TOCA EL MENU PARA VER LA INFORMACION
      </p>
    </>
  );
}
