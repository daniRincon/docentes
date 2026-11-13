import type { Metadata } from "next";
import { COLORES, LineChart } from "@/components/Charts";
import { Card, CompareBars, Kpi, Origen, ViewHead } from "@/components/ui";
import { COMPARADORES_2024 } from "@/data/indicadores";
import { getIndicadoresMen } from "@/lib/datosgov";
import { fmt, pct } from "@/lib/format";

export const metadata: Metadata = { title: "Estudiantes" };
export const revalidate = 86400;

export default async function Estudiantes() {
  const men = await getIndicadoresMen();
  const { serie, ultimo } = men.datos;
  const faltantes = Array.from({ length: serie.anios[serie.anios.length - 1] - serie.anios[0] + 1 }, (_, i) => serie.anios[0] + i).filter((a) => !serie.anios.includes(a));

  return (
    <>
      <ViewHead
        seccion="Estudiantes"
        eyebrow="02 · Población escolar"
        titulo="Estudiantes"
        kpis={
          <>
            <Kpi titulo="Población 5–16 años" valor={fmt(ultimo.poblacion5a16)} nota={`MEN · ${ultimo.anio}`} />
            <Kpi titulo="Cobertura neta media" valor={pct(ultimo.coberturaMedia)} tono="bad" nota={`Bogotá: 65,3% · ${ultimo.anio}`} />
            <Kpi titulo="Deserción" valor={pct(ultimo.desercion, 2)} tono="ok" nota={`Cali: 4,41% · ${ultimo.anio}`} />
            <Kpi titulo="Reprobación" valor={pct(ultimo.reprobacion)} nota={`Secundaria: ${pct(ultimo.reprobacionSecundaria)} · ${ultimo.anio}`} />
          </>
        }
      >
        Casi todos los niños entran a la escuela, pero menos de la mitad llega a la educación media a la edad esperada. La cobertura en primaria
        supera el 100% porque Quibdó recibe estudiantes de otros municipios del Chocó y estudiantes en extraedad.
      </ViewHead>

      <div className="grid2">
          <Card
            titulo={`Cobertura neta por nivel, ${serie.anios[0]}–${ultimo.anio}`}
            sub="Porcentaje de la población en edad matriculada en su nivel"
            nota={faltantes.length ? `El MEN no publicó el registro de Quibdó para ${faltantes.join(", ")}.` : undefined}
          >
            <LineChart
              labels={serie.anios}
              alto={350}
              min={20}
              max={110}
              sufijo="%"
              ariaLabel="Cobertura neta por nivel"
              series={[
                { label: "Transición", data: serie.coberturaTransicion, color: COLORES.choco },
                { label: "Primaria", data: serie.coberturaPrimaria, color: COLORES.verde },
                { label: "Secundaria", data: serie.coberturaSecundaria, color: COLORES.colombia },
                { label: "Media", data: serie.coberturaMedia, color: COLORES.quibdo, grosor: 4 },
              ]}
            />
          </Card>
          <Card titulo="Cobertura neta en media, 2024" sub="Quibdó frente a las secretarías de las principales ciudades">
            <CompareBars filas={COMPARADORES_2024.coberturaMedia} max={100} sufijo="%" />
            <h3 style={{ marginTop: 26 }}>Deserción intraanual, 2024</h3>
            <p className="sub">Menor es mejor</p>
            <CompareBars filas={COMPARADORES_2024.desercion} max={5} sufijo="%" />
            <p className="note">Quibdó retiene a sus estudiantes mejor que Cali, Medellín y Bogotá. El reto es lo que aprenden mientras están en el aula.</p>
          </Card>
          <Card titulo={`Deserción y reprobación, ${serie.anios[0]}–${ultimo.anio}`} sub="Tasas sobre la matrícula total; la reprobación en secundaria se muestra aparte" span2>
            <LineChart
              labels={serie.anios}
              min={0}
              max={18}
              sufijo="%"
              ariaLabel="Deserción y reprobación"
              series={[
                { label: "Deserción", data: serie.desercion, color: COLORES.quibdo },
                { label: "Reprobación total", data: serie.reprobacion, color: COLORES.choco },
                { label: "Reprobación en secundaria", data: serie.reprobacionSecundaria, color: COLORES.malo, punteada: true },
              ]}
            />
            <Origen origen={men.origen} consultado={men.consultado} />
          </Card>
      </div>
    </>
  );
}
