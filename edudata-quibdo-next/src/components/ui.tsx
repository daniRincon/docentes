import Link from "next/link";
import type { ReactNode } from "react";
import { fmt } from "@/lib/format";

/** Cifra clave: etiqueta, valor grande y nota de fuente. Va dentro de ViewHead (fila con reglas). */
export function Kpi({ titulo, valor, nota, tono }: { titulo: string; valor: ReactNode; nota?: ReactNode; tono?: "bad" | "ok" }) {
  return (
    <div className="fig">
      <span className="fig-l">{titulo}</span>
      <span className={`fig-v${tono === "bad" ? " mal" : tono === "ok" ? " bien" : ""}`}>{valor}</span>
      {nota && <span className="fig-n">{nota}</span>}
    </div>
  );
}

/** Encabezado de cada sección: ruta, título, texto y fila de cifras clave. */
export function ViewHead({ seccion, titulo, children, kpis }: { seccion: string; eyebrow?: string; titulo: string; children: ReactNode; kpis?: ReactNode }) {
  return (
    <header style={{ display: "grid", gap: 28 }}>
      <div className="page-head">
        <div className="crumb"><Link href="/">Inicio</Link> / {seccion}</div>
        <h1>{titulo}</h1>
        <p className="lead">{children}</p>
      </div>
      {kpis && <div className="figures">{kpis}</div>}
    </header>
  );
}

export function Card({ titulo, sub, children, span2, nota }: { titulo: string; sub?: string; children: ReactNode; span2?: boolean; nota?: ReactNode }) {
  return (
    <section className={`panel${span2 ? " ancho" : ""}`}>
      <h3>{titulo}</h3>
      {sub && <p className="sub">{sub}</p>}
      <div style={{ marginTop: 16 }}>{children}</div>
      {nota && <p className="note">{nota}</p>}
    </section>
  );
}

/** Barras horizontales de comparación; la fila "propio" se resalta. */
export function CompareBars({ filas, max, decimales = 1, sufijo = "" }: { filas: { nombre: string; valor: number; propio?: boolean }[]; max: number; decimales?: number; sufijo?: string }) {
  return (
    <div className="cmp">
      {filas.map((f) => (
        <div key={f.nombre} className={`cmp-row${f.propio ? " me" : ""}`}>
          <span>{f.nombre}</span>
          <div className="cmp-track"><div className="cmp-fill" style={{ width: `${(f.valor / max) * 100}%` }} /></div>
          <span className="num">{fmt(f.valor, decimales)}{sufijo}</span>
        </div>
      ))}
    </div>
  );
}

/** Indica al lector si la cifra vino de la API en vivo o del respaldo local. */
export function Origen({ origen, consultado }: { origen: "en-vivo" | "respaldo"; consultado: string }) {
  const fecha = new Date(consultado).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  return (
    <p className={`origen${origen === "respaldo" ? " respaldo" : ""}`}>
      <i aria-hidden="true" />
      {origen === "en-vivo" ? `Datos del MEN consultados en datos.gov.co el ${fecha}` : `datos.gov.co no respondió; se muestra la última copia guardada (${fecha})`}
    </p>
  );
}
