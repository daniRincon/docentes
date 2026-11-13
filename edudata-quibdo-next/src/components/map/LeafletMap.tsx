"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Pane, Polygon, Polyline, Tooltip, useMap } from "react-leaflet";
import geoData from "@/data/geo.json";
import { fmt } from "@/lib/format";
import type { GeoCapas, Institucion } from "@/lib/types";
import { COLOR_TIPO, ESTILO_MAPA as E } from "./estiloMapa";

const GEO = geoData as unknown as GeoCapas;
const ll = (c: [number, number][]) => c.map(([lon, lat]) => [lat, lon] as [number, number]);

const BOUNDS_URBANO = L.latLngBounds(GEO.urban.flatMap(ll)).pad(0.04);
const BOUNDS_MUNICIPIO = L.latLngBounds(GEO.muni.flatMap(ll)).pad(0.02);

export type Vista = "urbano" | "municipio";

interface Props {
  instituciones: Institucion[];
  visibles: boolean[];
  seleccion: number | null;
  onSeleccion: (i: number | null) => void;
  vista: Vista;
  mostrarOsm: boolean;
}

/** Mueve la cámara cuando cambia la vista o la institución seleccionada. */
function Camara({ vista, destino }: { vista: Vista; destino: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    // En escritorio el panel flotante tapa ~340 px a la derecha: se deja ese margen.
    const panel = window.innerWidth > 900 ? 340 : 0;
    map.flyToBounds(vista === "urbano" ? BOUNDS_URBANO : BOUNDS_MUNICIPIO, { duration: 0.8, paddingTopLeft: [20, 60], paddingBottomRight: [panel, 20] });
  }, [map, vista]);
  useEffect(() => {
    if (destino) map.flyTo(destino, BOUNDS_URBANO.contains(destino) ? 15.5 : 12.5, { duration: 0.7 });
  }, [map, destino]);
  return null;
}

/** Recuadro oscuro al pasar el mouse, igual al del mapa de Colombia. */
const hint = { className: "map-hint", direction: "top" as const, offset: [0, -6] as [number, number], opacity: 1 };

/**
 * Mapa de instituciones con el estilo del mapa de Colombia (@react-map/colombia):
 * áreas de color plano con borde blanco, color de realce al pasar el mouse, color de selección al hacer clic.
 */
export default function LeafletMap({ instituciones, visibles, seleccion, onSeleccion, vista, mostrarOsm }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  // Puntos OSM que no coinciden con una institución ya ubicada (evita duplicados).
  const otrasSedes = useMemo(() => {
    const propias = instituciones.flatMap((i) => (i.ubicacion ? [i.ubicacion] : []));
    return GEO.osm.filter(([la, lo]) => !propias.some((p) => Math.abs(p.lat - la) < 0.0004 && Math.abs(p.lon - lo) < 0.0004));
  }, [instituciones]);

  const sel = seleccion !== null ? instituciones[seleccion]?.ubicacion : null;
  const destino = useMemo<[number, number] | null>(() => (sel ? [sel.lat, sel.lon] : null), [sel]);
  const sobre = (id: string) => ({ mouseover: () => setHover(id), mouseout: () => setHover((h) => (h === id ? null : h)) });

  return (
    <MapContainer bounds={BOUNDS_URBANO} minZoom={8} maxZoom={18} zoomSnap={0.25} style={{ position: "absolute", inset: 0, background: E.fondo }} attributionControl>
      <Pane name="base" style={{ zIndex: 350 }}>
        <Polygon positions={GEO.muni.map(ll)} pathOptions={{ color: E.borde, weight: E.grosorBorde * 2, fillColor: E.municipio, fillOpacity: 1 }} />
        {GEO.urban.map((r, i) => {
          const id = `u${i}`;
          return (
            <Polygon key={id} positions={ll(r)} eventHandlers={sobre(id)}
              pathOptions={{ color: E.borde, weight: E.grosorBorde * 2, fillColor: hover === id ? E.realce : E.urbano, fillOpacity: 1 }}>
              <Tooltip {...hint} sticky>Casco urbano de Quibdó</Tooltip>
            </Polygon>
          );
        })}
      </Pane>
      <Pane name="lineas" style={{ zIndex: 380 }}>
        {GEO.roads.map((r, i) => (
          <Polyline key={`v${i}`} positions={ll(r.c)} interactive={false} pathOptions={{ color: E.borde, weight: r.h === "s" ? 1.4 : 2.4, opacity: 0.9 }} />
        ))}
        {GEO.rivers.map((r, i) => {
          const id = `r${i}`;
          return (
            <Polyline key={id} positions={ll(r.c)} eventHandlers={sobre(id)}
              pathOptions={{ color: hover === id ? E.realce : E.rio, weight: r.a ? 5 : 1.6, opacity: 1 }}>
              {r.n && <Tooltip {...hint} sticky>{r.n}</Tooltip>}
            </Polyline>
          );
        })}
      </Pane>

      {mostrarOsm &&
        otrasSedes.map(([la, lo, n], i) => (
          <CircleMarker key={`o${i}`} center={[la, lo]} radius={3} pathOptions={{ color: E.borde, weight: 1, fillColor: E.otrasSedes, fillOpacity: 1 }}>
            <Tooltip {...hint}>{n}<br /><small>Sede registrada en OpenStreetMap</small></Tooltip>
          </CircleMarker>
        ))}

      {instituciones.map((r, i) => {
        if (!r.ubicacion) return null;
        const id = `i${i}`;
        const exacta = r.ubicacion.precision === "sede";
        const on = visibles[i] || seleccion === i;
        const esSel = seleccion === i;
        const relleno = esSel ? E.seleccion : hover === id ? E.realce : COLOR_TIPO[r.tipo] ?? E.realce;
        return (
          <CircleMarker
            key={r.nombre}
            center={[r.ubicacion.lat, r.ubicacion.lon]}
            radius={5 + Math.sqrt(r.matricula) / 8 + (esSel ? 2 : 0)}
            pathOptions={{
              color: E.borde,
              weight: esSel ? 3 : 1.5,
              dashArray: exacta ? undefined : "3 3",
              fillColor: relleno,
              fillOpacity: on ? 1 : 0.18,
              opacity: on ? 1 : 0.3,
            }}
            eventHandlers={{ ...sobre(id), click: () => onSeleccion(esSel ? null : i) }}
          >
            <Tooltip {...hint}>
              <b>{r.nombre}</b><br />
              {fmt(r.matricula)} estudiantes, {r.sedes} sede{r.sedes > 1 ? "s" : ""}
              {!exacta && <><br /><small>Ubicación aproximada</small></>}
            </Tooltip>
          </CircleMarker>
        );
      })}

      <Camara vista={vista} destino={destino} />
    </MapContainer>
  );
}
