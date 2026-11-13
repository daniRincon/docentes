import geoData from "@/data/geo.json";
import type { GeoCapas, Institucion } from "@/lib/types";

const GEO = geoData as unknown as GeoCapas;
const W = 600;
const H = 510;
const PAD = 28;

/**
 * Ilustración de la portada: el municipio, sus ríos y las instituciones oficiales,
 * dibujados con las mismas coordenadas del mapa (proyección equirectangular simple).
 */
export function AtratoArt({ instituciones }: { instituciones: Institucion[] }) {
  const pts = GEO.muni.flat();
  const lons = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...lons), Math.max(...lons), Math.min(...lats), Math.max(...lats)];
  const k = Math.min((W - 2 * PAD) / (x1 - x0), (H - 2 * PAD) / (y1 - y0));
  const ox = (W - (x1 - x0) * k) / 2;
  const oy = (H - (y1 - y0) * k) / 2;
  const px = (lon: number) => ox + (lon - x0) * k;
  const py = (lat: number) => oy + (y1 - lat) * k;
  const path = (c: [number, number][], cerrar = false) =>
    c.map(([lon, lat], i) => `${i ? "L" : "M"}${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`).join("") + (cerrar ? "Z" : "");

  const atrato = GEO.rivers.filter((r) => r.a);
  const otros = GEO.rivers.filter((r) => !r.a);

  return (
    <figure className="hero-art">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Municipio de Quibdó con el río Atrato y las instituciones educativas oficiales">
        {GEO.muni.map((r, i) => (
          <path key={`m${i}`} d={path(r, true)} fill="#17503F" stroke="#2D6B58" strokeWidth="1.2" />
        ))}
        {otros.map((r, i) => (
          <path key={`o${i}`} d={path(r.c)} fill="none" stroke="#3F8F8F" strokeWidth="1" strokeOpacity=".55" />
        ))}
        {GEO.urban.map((r, i) => (
          <path key={`u${i}`} d={path(r, true)} fill="#2D6B58" />
        ))}
        {atrato.map((r, i) => (
          <path key={`a${i}`} className="rio" pathLength={1} d={path(r.c)} fill="none" stroke="#5FB7BE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {/* Corriente: trazos claros que avanzan siempre río abajo (el Atrato corre de sur a norte). */}
        {atrato.map((r, i) => {
          const haciaNorte = r.c[r.c.length - 1][1] > r.c[0][1];
          return (
            <path key={`c${i}`} className={`corriente${haciaNorte ? "" : " inversa"}`} pathLength={1} d={path(r.c)}
              fill="none" stroke="#DDF3F3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          );
        })}
        {instituciones.map((r) =>
          r.ubicacion ? (
            <circle key={r.nombre} cx={px(r.ubicacion.lon)} cy={py(r.ubicacion.lat)} r={2 + Math.sqrt(r.matricula) / 22} fill="#E9A923" stroke="#0F3B32" strokeWidth="1" />
          ) : null,
        )}
      </svg>
      <figcaption>
        <b>Quibdó y el río Atrato</b>
        <span className="leyenda-punto"><i aria-hidden="true" />Los puntos amarillos son las instituciones educativas oficiales. Entre más grande el punto, más estudiantes tiene.</span>
      </figcaption>
    </figure>
  );
}
