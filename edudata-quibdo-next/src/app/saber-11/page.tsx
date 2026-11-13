import type { Metadata } from "next";
import { BarChart, COLORES, LineChart } from "@/components/Charts";
import { Card, CompareBars, Kpi, ViewHead } from "@/components/ui";
import { AREAS_2026, RESULTADOS_COLEGIOS_2022, SABER11_MUNICIPIO_ULTIMO, SERIE_SABER11 } from "@/data/saber11";
import { fmt } from "@/lib/format";

export const metadata: Metadata = { title: "Examen Saber 11" };

export default function Saber11() {
  const s = SERIE_SABER11;
  const brecha = s.matematicasQuibdo.map((q, i) => +(s.matematicasColombia[i] - q).toFixed(1));
  const mejor = RESULTADOS_COLEGIOS_2022[0];
  const rurales = RESULTADOS_COLEGIOS_2022.filter((r) => r.zona === "Rural");

  return (
    <>
      <ViewHead
        seccion="Saber 11"
        eyebrow="03 · Pruebas estandarizadas"
        titulo="Examen Saber 11"
        kpis={
          <>
            <Kpi titulo={`Puntaje global · ${SABER11_MUNICIPIO_ULTIMO.anio}`} valor={SABER11_MUNICIPIO_ULTIMO.global} nota={`Colombia: ${SABER11_MUNICIPIO_ULTIMO.colombia} · 2026 estimado: 242`} />
            <Kpi titulo="Matemáticas · 2026" valor={AREAS_2026.quibdo[0]} tono="bad" nota={`Colombia: ${AREAS_2026.colombia[0]} · Chocó: ${AREAS_2026.choco[0]}`} />
            <Kpi titulo="Ciencias naturales · 2026" valor={AREAS_2026.quibdo[1]} tono="bad" nota={`Colombia: ${AREAS_2026.colombia[1]} · Chocó: ${AREAS_2026.choco[1]}`} />
            <Kpi titulo="Evaluados · 2026" valor={fmt(AREAS_2026.evaluadosQuibdo)} nota="Estudiantes de Quibdó · ICFES" />
          </>
        }
      >
        Quibdó supera al Chocó y viene mejorando: su puntaje global pasó de 227 en 2023 a 236 en 2025. Aun así sigue unos 25 puntos por debajo del país.
        En 2026 la distancia fue de 5 puntos en matemáticas y de 3 en ciencias, mientras que en inglés Quibdó (57) superó al promedio nacional (53).
      </ViewHead>

      <div className="grid2">
          <Card
            titulo="Puntaje global promedio"
            sub="Escala 0–500 · calendario A"
            nota="2014–2022: datos abiertos del ICFES (2019* y 2022* agrupan varias aplicaciones). 2023–2026: reportes del ICFES para entidades territoriales. 2026†: el ICFES no publicó el puntaje global municipal; se estimó con la ponderación oficial a partir de los promedios por prueba. El Chocó no se consultó para 2023–2025."
          >
            <LineChart
              labels={s.etiquetas}
              min={190}
              max={270}
              ariaLabel="Puntaje global Quibdó, Chocó y Colombia"
              series={[
                { label: "Colombia", data: s.globalColombia, color: COLORES.colombia },
                { label: "Quibdó", data: s.globalQuibdo, color: COLORES.quibdo, grosor: 4 },
                { label: "Chocó", data: s.globalChoco, color: COLORES.choco, unirHuecos: true },
              ]}
            />
          </Card>
          <Card titulo="Puntaje por área STEM, 2026" sub="Escala 0–100">
            <BarChart
              labels={[...AREAS_2026.pruebas]}
              min={30}
              max={60}
              ariaLabel="Puntajes por área 2026"
              series={[
                { label: "Quibdó", data: [...AREAS_2026.quibdo], color: COLORES.quibdo },
                { label: "Chocó", data: [...AREAS_2026.choco], color: COLORES.choco },
                { label: "Colombia", data: [...AREAS_2026.colombia], color: COLORES.colombia },
              ]}
            />
          </Card>
          <Card titulo="Matemáticas: una brecha persistente" sub="Puntos por debajo del promedio nacional">
            <BarChart
              labels={s.etiquetas}
              min={0}
              max={8}
              leyenda={false}
              ariaLabel="Brecha en matemáticas frente al país"
              series={[{ label: "Puntos por debajo del país", data: brecha, color: COLORES.choco }]}
              coloresPorBarra={brecha.map((_, i) => (i === brecha.length - 1 ? COLORES.malo : COLORES.choco))}
            />
          </Card>
          <Card
            titulo="Desigualdad entre colegios de Quibdó"
            sub="Puntaje global 2022, último año con resultados por colegio en datos abiertos"
            nota={`${fmt(mejor.global - Math.min(...rurales.map((r) => r.global)))} puntos separan a la institución oficial con mejor resultado (${mejor.nombre}, ${fmt(mejor.global)}) de los colegios agropecuarios rurales.`}
          >
            <CompareBars
              max={300}
              filas={[
                { nombre: "Mejor oficial", valor: mejor.global },
                { nombre: "Promedio país", valor: 250.1 },
                { nombre: "Quibdó", valor: 220.7, propio: true },
                ...rurales.map((r) => ({ nombre: `Rural ${r.nombre.split(" ").pop()}`, valor: r.global })),
              ]}
            />
          </Card>
          <Card titulo="Resultados por institución oficial, Saber 11 2022" sub="Promedio de los estudiantes evaluados en cada institución" span2>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>#</th><th>Colegio</th><th>Zona</th><th className="r">Evaluados</th><th>Global</th><th className="r">Matemáticas</th></tr></thead>
                <tbody>
                  {RESULTADOS_COLEGIOS_2022.map((r, i) => (
                    <tr key={r.nombre}>
                      <td className="num">{i + 1}</td>
                      <td className="name">{r.nombre}</td>
                      <td>{r.zona === "Rural" ? <span className="pill">Rural</span> : "Urbana"}</td>
                      <td className="r num">{r.evaluados}</td>
                      <td className="num">
                        <span className="bar" style={{ width: ((r.global - 150) / 120) * 110, background: r.global >= 250 ? "var(--bien)" : r.global >= 210 ? "var(--oro)" : "var(--mal)" }} />
                        {fmt(r.global, 1)}
                      </td>
                      <td className="r num">{fmt(r.matematicas, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
      </div>
    </>
  );
}
