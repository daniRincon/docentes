import Link from "next/link";
import { AtratoArt } from "@/components/AtratoArt";
import { MapExplorer } from "@/components/map/MapExplorer";
import { SectionCarousel, type TarjetaSeccion } from "@/components/SectionCarousel";
import { Origen } from "@/components/ui";
import { INSTITUCIONES } from "@/data/instituciones";
import { SABER11_MUNICIPIO_ULTIMO } from "@/data/saber11";
import { getIndicadoresMen } from "@/lib/datosgov";
import { fmt, pct } from "@/lib/format";

export const revalidate = 86400; // vuelve a consultar datos.gov.co como máximo una vez al día

export default async function Inicio() {
  const men = await getIndicadoresMen();
  const { ultimo } = men.datos;
  const enMedia = Math.round(ultimo.coberturaMedia);
  const sedes = INSTITUCIONES.reduce((a, r) => a + r.sedes, 0);

  const secciones: TarjetaSeccion[] = [
    { href: "/establecimientos", cta: "Ver instituciones", titulo: "Instituciones", texto: "Dónde están las instituciones oficiales, cuántas sedes tienen y cuántos estudiantes atienden.", fig: String(INSTITUCIONES.length), figTexto: `instituciones y ${sedes} sedes` },
    { href: "/estudiantes", cta: "Ver estudiantes", titulo: "Estudiantes", texto: "Cobertura por nivel, deserción y reprobación desde 2011, comparadas con otras ciudades.", fig: pct(ultimo.coberturaMedia), figTexto: `cobertura en media, ${ultimo.anio}` },
    { href: "/saber-11", cta: "Ver resultados", titulo: "Saber 11", texto: "Resultados del examen por prueba y por colegio, frente al Chocó y al país.", fig: String(SABER11_MUNICIPIO_ULTIMO.global), figTexto: `puntaje global, ${SABER11_MUNICIPIO_ULTIMO.anio}` },
    { href: "/invertir-en-stem", cta: "Ver el caso para donantes", titulo: "Invertir en STEM", texto: "Las brechas que muestran los datos y lo que una donación puede cambiar.", fig: "5 puntos", figTexto: "de brecha en matemáticas", destacada: true },
    { href: "/fuentes", cta: "Ver fuentes", titulo: "Fuentes", texto: "De dónde sale cada cifra, cada cuánto se actualiza y cómo leerla.", fig: "5", figTexto: "fuentes oficiales y abiertas" },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Solo {enMedia} de cada 100 jóvenes de Quibdó están en la educación media a la edad esperada.</h1>
          <p className="lead">
            InfoEdu Quibdó reúne los datos oficiales de la Secretaría de Educación, el Ministerio de Educación y el ICFES para mostrar dónde
            están las brechas y por qué la educación STEM puede ayudar a cerrarlas.
          </p>
          <div className="hero-actions">
            <Link className="btn oro" href="/invertir-en-stem">Ver el caso para donantes</Link>
            <Link className="btn linea" href="#mapa">Explorar el mapa</Link>
          </div>
        </div>
        <AtratoArt instituciones={INSTITUCIONES} />
      </section>

      <SectionCarousel tarjetas={secciones} />

      <section id="mapa" style={{ display: "grid", gap: 20, scrollMarginTop: 80 }}>
        <div className="sec-head">
          <h2>Mapa de instituciones oficiales</h2>
          <p>
            {INSTITUCIONES.length} instituciones y {fmt(sedes)} sedes, del casco urbano a las comunidades del Atrato. El tamaño de cada punto es su
            matrícula 2025. Haz clic en uno para ver sus datos.
          </p>
        </div>
        <MapExplorer instituciones={INSTITUCIONES} ultimo={ultimo} saber11Municipio={SABER11_MUNICIPIO_ULTIMO} />
        <Origen origen={men.origen} consultado={men.consultado} />
      </section>
    </>
  );
}
