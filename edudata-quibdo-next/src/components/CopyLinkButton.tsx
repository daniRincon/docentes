"use client";

import { useState } from "react";

export function CopyLinkButton({ ruta }: { ruta: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const copiar = async () => {
    const url = `${window.location.origin}${ruta}`;
    try {
      await navigator.clipboard.writeText(url);
      setMsg("Enlace copiado");
    } catch {
      setMsg(`Copia este enlace: ${url}`);
    }
    window.setTimeout(() => setMsg(null), 3000);
  };
  return (
    <>
      <button className="btn oro" type="button" onClick={copiar}>Copiar enlace para compartir</button>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  );
}
