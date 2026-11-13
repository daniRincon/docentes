import type { Metadata } from "next";
import { BarChart, COLORES, DoughnutChart } from "@/components/Charts";
import { InstitucionesTable } from "@/components/InstitucionesTable";
import { Card, Kpi, Origen, ViewHead } from "@/components/ui";
import { INSTITUCIONES } from "@/data/instituciones";
import { getMatriculaOficial } from "@/lib/datosgov";
import { fmt } from "@/lib/format";

export const metadata: Metadata = { title: "Establecimientos Educativos" };
export const revalidate = 86400;

export default async function Establecimientos() {
  const mat = await getMatriculaOficial();
  const { anios, matricula } = mat.datos;
  const ultimo = matricula[matricula.length - 1];
  const primero = matricula[0];
  const variacion = ((ultimo - primero) / primero) * 100;
  const sedes = INSTITUCIONES.reduce((a, r) => a + r.sedes, 0);
  const porTipo = Object.entries(
    INSTITUCIONES.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.tipo]: (acc[r.tipo] ?? 0) + 1 }), {}),
  );

  return (
    <>
      <ViewHead
        seccion="Establecimientos"
        eyebrow="01 · Infraestructura"
        titulo="Establecimientos Educativos"
        kpis={
          <>
            <Kpi titulo="Instituciones oficiales" valor={INSTITUCIONES.length} nota="Secretaría de Educación de Quibdó · 2025" />
            <Kpi titulo="Sedes oficiales" valor={sedes} nota="Urbanas, rurales e indígenas · 2025" />
            <Kpi titulo="Matrícula oficial" valor={fmt(ultimo)} nota={`Reportada por las instituciones · ${anios[anios.length - 1]}`} />
            <Kpi titulo="Variación matrícula oficial" valor={`${variacion > 0 ? "+" : "−"}${fmt(Math.abs(variacion), 1)}%`} tono={variacion < 0 ? "bad" : "ok"} nota={`${anios[0]} → ${anios[anios.length - 1]}`} />
          </>
        }
      >
        Nueve de cada diez estudiantes de Quibdó están en el sector oficial. La Secretaría administra {INSTITUCIONES.length} instituciones con {sedes} sedes,
        incluidas sedes rurales sobre el Atrato y tres centros educativos indígenas Embera con 10 o más sedes cada uno.
      </ViewHead>

      <div className="grid2">
          <Card titulo={`Matrícula oficial, ${anios[0]}–${anios[anios.length - 1]}`} sub="Suma de la matrícula reportada por las instituciones oficiales">
            <BarChart labels={anios} series={[{ label: "Matrícula oficial", data: matricula, color: COLORES.quibdo }]} min={0} leyenda={false} entero ariaLabel="Matrícula oficial por año" />
            <Origen origen={mat.origen} consultado={mat.consultado} />
          </Card>
          <Card titulo="Tipo de institución" sub={`${INSTITUCIONES.length} instituciones oficiales, 2025`}>
            <DoughnutChart labels={porTipo.map(([t]) => t)} data={porTipo.map(([, n]) => n)} colores={[COLORES.quibdo, COLORES.verde, COLORES.choco, COLORES.colombia, COLORES.malo]} ariaLabel="Instituciones oficiales por tipo" />
          </Card>
          <Card titulo="Directorio de instituciones oficiales 2025" sub="Ministerio de Educación Nacional" span2>
            <InstitucionesTable instituciones={INSTITUCIONES} />
          </Card>
      </div>
    </>
  );
}
