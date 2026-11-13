"use client";

import { useMemo, useState } from "react";
import { fmt } from "@/lib/format";
import type { Institucion } from "@/lib/types";

export function InstitucionesTable({ instituciones }: { instituciones: Institucion[] }) {
  const [q, setQ] = useState("");
  const maxMat = Math.max(...instituciones.map((r) => r.matricula));
  const filas = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? instituciones.filter((r) => `${r.nombre} ${r.barrio}`.toLowerCase().includes(t)) : instituciones;
  }, [q, instituciones]);

  return (
    <>
      <div>
        <input className="search" id="buscar-institucion" type="search" placeholder="Buscar institución o barrio…" aria-label="Buscar institución o barrio" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Institución</th><th>Tipo</th><th>Barrio / vereda</th><th className="r">Sedes</th><th>Matrícula</th></tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={r.nombre}>
                <td className="name">{r.nombre}</td>
                <td>{r.tipo}</td>
                <td>{r.barrio}</td>
                <td className="r num">{r.sedes}</td>
                <td className="num"><span className="bar" style={{ width: Math.max(2, (r.matricula / maxMat) * 110) }} />{fmt(r.matricula)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">{filas.length} de {instituciones.length} instituciones · {fmt(filas.reduce((a, r) => a + r.matricula, 0))} estudiantes</p>
    </>
  );
}
