"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { fmt, pct } from "@/lib/format";
import type { Institucion, UltimoAnio } from "@/lib/types";
import { COLOR_TIPO } from "./estiloMapa";
import type { Vista } from "./LeafletMap";

// Leaflet usa `window`: se carga solo en el navegador.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <p style={{ padding: 24, color: "var(--gris)" }}>Cargando el mapa…</p>,
});

interface Props {
  instituciones: Institucion[];
  ultimo: UltimoAnio;
  saber11Municipio: { anio: number; global: number };
}

const RANGOS = { g: (m: number) => m > 1000, m: (m: number) => m >= 200 && m <= 1000, s: (m: number) => m < 200 } as const;

export function MapExplorer({ instituciones, ultimo, saber11Municipio }: Props) {
  const [tipo, setTipo] = useState("");
  const [rango, setRango] = useState<"" | keyof typeof RANGOS>("");
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [vista, setVista] = useState<Vista>("urbano");
  const [mostrarOsm, setMostrarOsm] = useState(false);

  const tipos = useMemo(() => [...new Set(instituciones.map((r) => r.tipo))], [instituciones]);
  const visibles = useMemo(
    () => instituciones.map((r) => (!tipo || r.tipo === tipo) && (!rango || RANGOS[rango](r.matricula))),
    [instituciones, tipo, rango],
  );
  const filas = instituciones.filter((_, i) => visibles[i]);
  const filtrado = Boolean(tipo || rango);
  const sinUbicacion = filas.filter((r) => !r.ubicacion).length;
  const sel = seleccion !== null ? instituciones[seleccion] : null;

  const sedes = sel ? sel.sedes : filas.reduce((a, r) => a + r.sedes, 0);
  const matricula = sel ? sel.matricula : filas.reduce((a, r) => a + r.matricula, 0);
  const limpiar = () => { setTipo(""); setRango(""); setSeleccion(null); setVista("urbano"); };

  return (
    <div className="map-stage">
      <div className="map-canvas">
        <div id="map">
          <LeafletMap instituciones={instituciones} visibles={visibles} seleccion={seleccion} onSeleccion={setSeleccion} vista={vista} mostrarOsm={mostrarOsm} />
        </div>
        <div className="mapbtns" role="group" aria-label="Vista del mapa">
          <button type="button" className={vista === "urbano" ? "on" : ""} aria-pressed={vista === "urbano"} onClick={() => setVista("urbano")}>Casco urbano</button>
          <button type="button" className={vista === "municipio" ? "on" : ""} aria-pressed={vista === "municipio"} onClick={() => setVista("municipio")}>Todo el municipio</button>
        </div>
        <div className="legend">
          {tipos.map((t) => (
            <div key={t}><i className="tipo" style={{ background: COLOR_TIPO[t] }} />{t} ({filas.filter((r) => r.tipo === t).length})</div>
          ))}
          <div><i className="ring" />Ubicación aproximada</div>
          <label>
            <input type="checkbox" checked={mostrarOsm} onChange={(e) => setMostrarOsm(e.target.checked)} />
            <i className="osm" />Otras sedes en OpenStreetMap
          </label>
          {sinUbicacion > 0 && <span className="nl">{sinUbicacion} sin ubicación conocida</span>}
        </div>
      </div>

      <aside className="map-panel" aria-live="polite">
        <div className="mp-title">
          <b>{sel ? sel.nombre : filtrado ? "Instituciones filtradas" : "Todas las instituciones oficiales"}</b>
          <small>{sel ? `${sel.tipo}, ${sel.barrio}${sel.ubicacion ? "" : ". Sin ubicación en el mapa"}` : `Quibdó, directorio MEN 2025`}</small>
        </div>

        <div className="mp-grid">
          <div><span>Sedes</span><b>{fmt(sedes)}</b></div>
          <div><span>Instituciones</span><b>{sel ? 1 : filas.length}</b></div>
          <div className="full"><span>Estudiantes matriculados en 2025</span><b>{fmt(matricula)}</b></div>
          <div className="full">
            <span>{sel ? "Saber 11 del colegio, 2022" : `Saber 11 de Quibdó, ${saber11Municipio.anio}`}</span>
            <b>{sel ? (sel.saber11Global2022 ? fmt(sel.saber11Global2022, 1) : "Sin dato") : fmt(saber11Municipio.global)}</b>
          </div>
        </div>

        <div className="mp-sep">Indicadores de Quibdó, MEN {ultimo.anio}</div>
        <div className="mp-grid">
          <div><span>Cobertura bruta</span><b>{pct(ultimo.coberturaBruta)}</b></div>
          <div><span>Cobertura neta</span><b>{pct(ultimo.coberturaNeta)}</b></div>
          <div><span>Deserción</span><b>{pct(ultimo.desercion, 2)}</b></div>
          <div><span>Cobertura en media</span><b>{pct(ultimo.coberturaMedia)}</b></div>
        </div>

        <div className="mp-sep">Filtrar</div>
        <label htmlFor="f-inst">Institución
          <select id="f-inst" value={seleccion ?? ""} onChange={(e) => setSeleccion(e.target.value === "" ? null : Number(e.target.value))}>
            <option value="">Todas ({instituciones.length})</option>
            {instituciones.map((r, i) => <option key={r.nombre} value={i}>{r.nombre}</option>)}
          </select>
        </label>
        <label htmlFor="f-tipo">Tipo
          <select id="f-tipo" value={tipo} onChange={(e) => { setTipo(e.target.value); setSeleccion(null); }}>
            <option value="">Todos</option>
            {tipos.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label htmlFor="f-mat">Matrícula
          <select id="f-mat" value={rango} onChange={(e) => { setRango(e.target.value as typeof rango); setSeleccion(null); }}>
            <option value="">Todas</option>
            <option value="g">Más de 1.000 estudiantes</option>
            <option value="m">Entre 200 y 1.000</option>
            <option value="s">Menos de 200</option>
          </select>
        </label>
        <button className="btn-text" type="button" onClick={limpiar} disabled={!filtrado && seleccion === null}>Quitar filtros</button>
      </aside>
    </div>
  );
}
