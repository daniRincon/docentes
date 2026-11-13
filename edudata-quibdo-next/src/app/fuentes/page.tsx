import type { Metadata } from "next";
import { ViewHead } from "@/components/ui";

export const metadata: Metadata = { title: "Fuentes y datos abiertos" };

const FUENTES = [
  {
    titulo: "Estadísticas en educación preescolar, básica y media por municipio",
    detalle: "Ministerio de Educación Nacional · 2011 en adelante · consulta automática diaria",
    url: "https://www.datos.gov.co/d/nudc-7mev",
    sitio: "datos.gov.co",
    codigo: "nudc-7mev · código municipio 27001",
  },
  {
    titulo: "Establecimientos educativos de preescolar, básica y media",
    detalle: "Ministerio de Educación Nacional · 2015 en adelante · matrícula oficial con consulta automática diaria",
    url: "https://www.datos.gov.co/d/cfw5-qzt5",
    sitio: "datos.gov.co",
    codigo: "cfw5-qzt5 · cod_dane_municipio 27001 · sector OFICIAL",
  },
  {
    titulo: "Resultados únicos Saber 11",
    detalle: "ICFES · periodos 2014–2022 (incluye resultados por colegio)",
    url: "https://www.datos.gov.co/d/kgxf-xxbe",
    sitio: "datos.gov.co",
    codigo: "kgxf-xxbe · promedios por colegio, municipio, departamento y país",
  },
  {
    titulo: "Resultados Saber 11 para entidades territoriales",
    detalle: "ICFES · aplicaciones 2023-4, 2024-3, 2025-3 y 2026-3 (calendario A) · carga manual",
    url: "https://resultados.icfes.edu.co/resultados-saber2016-web/pages/publicacionResultados/agregados/saber11/resultadosSecretarias.jsf",
    sitio: "resultados.icfes.edu.co",
    codigo: "Municipio de Quibdó y departamento del Chocó · consultado en noviembre de 2026",
  },
  {
    titulo: "Cartografía y ubicación de sedes",
    detalle: "OpenStreetMap: límite municipal, casco urbano, ríos, vías y escuelas · carga manual",
    url: "https://www.openstreetmap.org/relation/1343138",
    sitio: "openstreetmap.org",
    codigo: "Relación 1343138 (Quibdó) · © colaboradores de OpenStreetMap",
  },
];

export default function Fuentes() {
  return (
    <>
      <ViewHead seccion="Fuentes" eyebrow="05 · Metodología" titulo="Fuentes y datos abiertos">
        Todas las cifras provienen de datos abiertos oficiales. Los indicadores de cobertura, deserción y reprobación son los que la Secretaría de Educación
        de Quibdó (Entidad Territorial Certificada 4382) reporta al Ministerio de Educación Nacional a través del SIMAT.
      </ViewHead>
      <section className="sources" aria-label="Fuentes de datos">
          {FUENTES.map((f) => (
            <div className="source" key={f.titulo}>
              <b>{f.titulo}</b>
              <div>
                <p>{f.detalle}. Ver en <a href={f.url} target="_blank" rel="noopener">{f.sitio}</a></p>
                <code>{f.codigo}</code>
              </div>
            </div>
          ))}
          <div className="source">
            <b>Notas de lectura</b>
            <p>
              Una cobertura neta mayor a 100% indica que Quibdó atiende estudiantes de otros municipios o que las proyecciones de población están
              desactualizadas. La plataforma muestra solo instituciones oficiales; los indicadores del MEN y el promedio Saber 11 del municipio incluyen
              todos los sectores porque así se publican.
            </p>
          </div>
      </section>
    </>
  );
}
