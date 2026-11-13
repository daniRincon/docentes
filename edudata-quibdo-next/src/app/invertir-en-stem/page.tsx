import type { Metadata } from "next";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { Card, ViewHead } from "@/components/ui";
import { INSTITUCIONES } from "@/data/instituciones";
import { getIndicadoresMen, getMatriculaOficial } from "@/lib/datosgov";
import { fmt, pct } from "@/lib/format";

export const metadata: Metadata = { title: "Por qué invertir en STEM" };
export const revalidate = 86400;

export default async function InvertirEnStem() {
  const [men, mat] = await Promise.all([getIndicadoresMen(), getMatriculaOficial()]);
  const { serie, ultimo } = men.datos;
  const matOficial = mat.datos.matricula[mat.datos.matricula.length - 1];
  const i = serie.anios.length - 1;
  const embudo = [
    { label: "Transición (5 años)", v: serie.coberturaTransicion[i] },
    { label: "Primaria (6–10)", v: serie.coberturaPrimaria[i] },
    { label: "Secundaria (11–14)", v: serie.coberturaSecundaria[i] },
    { label: "Media (15–16)", v: serie.coberturaMedia[i] },
  ];

  const razones = [
    { big: "5", h: "puntos por debajo del país en matemáticas", p: "En 2026 Quibdó obtuvo 47 puntos en matemáticas y el país 52. Desde 2014 la distancia ha estado entre 5 y 7 puntos y nunca se ha cerrado. Sin una intervención distinta, no se corrige sola.", src: "ICFES Saber 11 · 2014–2026" },
    { big: fmt(100 - Math.round(ultimo.coberturaMedia)), h: "de cada 100 jóvenes de 15–16 años no están en la media", p: `Cobertura neta en media de ${pct(ultimo.coberturaMedia)}, frente a 65,3% en Bogotá. Un programa práctico como la robótica es una razón concreta para seguir estudiando.`, src: `MEN · cobertura neta media ${ultimo.anio}` },
    { big: pct(ultimo.desercion), h: "de deserción: los estudiantes se quedan", p: "Quibdó retiene a sus alumnos mejor que Cali (4,4%) o Medellín (3,2%). Los niños están en el aula; lo que falta es calidad y oportunidades en STEM.", src: `MEN · deserción intraanual ${ultimo.anio}` },
    { big: "76", h: "puntos entre el mejor colegio oficial y la zona rural", p: "Los colegios oficiales rurales obtienen 187 puntos; el mejor colegio oficial de la ciudad, 263. Llevar robótica a la ruralidad ataca la desigualdad donde es más profunda.", src: "ICFES Saber 11 · 2022, por colegio" },
    { big: "52%", h: "de las sedes con internet en la última medición", p: "En 2017 apenas la mitad de las sedes oficiales estaba conectada. Desde entonces el MEN no ha vuelto a publicar el dato para Quibdó.", src: "MEN · sedes conectadas 2017" },
    { big: fmt(matOficial), h: "estudiantes en el sector oficial", p: `Nueve de cada diez estudiantes dependen de ${INSTITUCIONES.length} instituciones públicas. Formar a sus docentes en STEM multiplica el impacto de cada donación.`, src: `MEN · matrícula ${mat.datos.anios[mat.datos.anios.length - 1]}` },
  ];

  return (
    <>
      <ViewHead seccion="Invertir en STEM" eyebrow="04 · Para donantes y aliados" titulo="Por qué invertir en educación STEM en Quibdó">
        La Escuela de Robótica del Chocó trabaja con estudiantes y docentes de Quibdó. Estas son las razones, con datos oficiales, por las que invertir
        aquí en ciencia, tecnología, ingeniería y matemáticas cambia trayectorias.
      </ViewHead>

      <div style={{ display: "grid", gap: 36 }}>
          <div className="reasons">
            {razones.map((r) => (
              <div className="reason" key={r.h}>
                <div className="big">{r.big}</div>
                <h3>{r.h}</h3>
                <p>{r.p}</p>
                <div className="src">{r.src}</div>
              </div>
            ))}
          </div>

          <Card titulo="De cada 100 niños y jóvenes en edad escolar" sub={`Cobertura neta por nivel, ${ultimo.anio}. Quibdó frente a Bogotá en educación media.`}>
            <div className="funnel-rows">
              {embudo.map((f) => (
                <div className="f-row" key={f.label}>
                  <span className="f-label">{f.label}</span>
                  <div className="f-track"><div className="f-bar" style={{ width: `${Math.min(f.v, 100)}%` }} /></div>
                  <span className="num">{Math.min(100, Math.round(f.v))}</span>
                </div>
              ))}
              <div className="f-row">
                <span className="f-label">Media en Bogotá</span>
                <div className="f-track"><div className="f-bar c" style={{ width: "65.32%" }} /></div>
                <span className="num">65</span>
              </div>
            </div>
          </Card>

          <div className="offer">
            <div><h3>Kits y laboratorios de robótica</h3><p>Dotación para colegios oficiales y sedes rurales, con laboratorios móviles que viajan por el Atrato.</p></div>
            <div><h3>Formación de docentes</h3><p>Docentes de matemáticas y ciencias formados en pensamiento computacional y aprendizaje por proyectos.</p></div>
            <div><h3>Clubes y competencias</h3><p>Jóvenes de media que construyen, programan y compiten, con un motivo más para terminar el bachillerato.</p></div>
          </div>

          <div className="pitch">
            <p>Invertir en STEM en Quibdó es cerrar una brecha que los datos oficiales muestran año tras año.</p>
            <CopyLinkButton ruta="/invertir-en-stem" />
          </div>
      </div>
    </>
  );
}
