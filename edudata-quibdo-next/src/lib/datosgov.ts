import "server-only";
import { INDICADORES_RESPALDO, MATRICULA_OFICIAL_RESPALDO } from "@/data/indicadores";
import type { ConOrigen, SerieIndicadores, UltimoAnio } from "@/lib/types";

/**
 * Cliente de datos.gov.co (Socrata).
 * - Consulta en el servidor y Next.js guarda la respuesta 24 h (revalidate), así la página
 *   se actualiza sola cuando el MEN publica un año nuevo.
 * - Si la API falla o responde algo inesperado, se usa el respaldo versionado en src/data.
 */
const BASE = "https://www.datos.gov.co/resource";
const CODIGO_MUNICIPIO = "27001"; // Quibdó
const UN_DIA = 60 * 60 * 24;

async function socrata<T>(dataset: string, params: Record<string, string>): Promise<T> {
  const url = `${BASE}/${dataset}.json?${new URLSearchParams(params)}`;
  const res = await fetch(url, { next: { revalidate: UN_DIA, tags: ["datosgov"] } });
  if (!res.ok) throw new Error(`datos.gov.co ${dataset} respondió ${res.status}`);
  return (await res.json()) as T;
}

const num = (v: string | undefined) => (v === undefined || v === "" ? NaN : Number(v));

type FilaMen = Record<string, string>;

const ULTIMO_RESPALDO: UltimoAnio = {
  anio: 2024,
  coberturaBruta: 111.66,
  coberturaNeta: 99,
  coberturaMedia: 45.12,
  desercion: 1.38,
  reprobacion: 6.3,
  reprobacionSecundaria: 7.47,
  poblacion5a16: 32562,
};

/** Estadísticas MEN por municipio (nudc-7mev): cobertura, deserción y reprobación de Quibdó. */
export async function getIndicadoresMen(): Promise<ConOrigen<{ serie: SerieIndicadores; ultimo: UltimoAnio }>> {
  const consultado = new Date().toISOString();
  try {
    const filas = await socrata<FilaMen[]>("nudc-7mev", {
      $where: `c_digo_municipio='${CODIGO_MUNICIPIO}'`,
      $order: "a_o",
      $select: [
        "a_o", "poblaci_n_5_16", "cobertura_neta", "cobertura_bruta",
        "cobertura_neta_transici_n", "cobertura_neta_primaria", "cobertura_neta_secundaria", "cobertura_neta_media",
        "deserci_n", "reprobaci_n", "reprobaci_n_secundaria",
      ].join(","),
    });
    if (!Array.isArray(filas) || filas.length < 5) throw new Error("respuesta vacía");

    const serie: SerieIndicadores = {
      anios: filas.map((f) => num(f.a_o)),
      coberturaTransicion: filas.map((f) => num(f.cobertura_neta_transici_n)),
      coberturaPrimaria: filas.map((f) => num(f.cobertura_neta_primaria)),
      coberturaSecundaria: filas.map((f) => num(f.cobertura_neta_secundaria)),
      coberturaMedia: filas.map((f) => num(f.cobertura_neta_media)),
      desercion: filas.map((f) => num(f.deserci_n)),
      reprobacion: filas.map((f) => num(f.reprobaci_n)),
      reprobacionSecundaria: filas.map((f) => num(f.reprobaci_n_secundaria)),
    };
    const u = filas[filas.length - 1];
    const ultimo: UltimoAnio = {
      anio: num(u.a_o),
      coberturaBruta: num(u.cobertura_bruta),
      coberturaNeta: num(u.cobertura_neta),
      coberturaMedia: num(u.cobertura_neta_media),
      desercion: num(u.deserci_n),
      reprobacion: num(u.reprobaci_n),
      reprobacionSecundaria: num(u.reprobaci_n_secundaria),
      poblacion5a16: num(u.poblaci_n_5_16),
    };
    if (Object.values(ultimo).some(Number.isNaN)) throw new Error("año más reciente incompleto");
    return { datos: { serie, ultimo }, origen: "en-vivo", consultado };
  } catch (e) {
    console.warn("[datosgov] usando respaldo de indicadores:", (e as Error).message);
    return { datos: { serie: INDICADORES_RESPALDO, ultimo: ULTIMO_RESPALDO }, origen: "respaldo", consultado };
  }
}

/** Matrícula oficial total por año (cfw5-qzt5, suma de la matrícula reportada por establecimiento). */
export async function getMatriculaOficial(): Promise<ConOrigen<{ anios: number[]; matricula: number[] }>> {
  const consultado = new Date().toISOString();
  try {
    const filas = await socrata<{ a_o: string; mat: string }[]>("cfw5-qzt5", {
      $select: "a_o,sum(total_matricula::number) as mat",
      $where: `cod_dane_municipio='${CODIGO_MUNICIPIO}' AND sector='OFICIAL'`,
      $group: "a_o",
      $order: "a_o",
    });
    if (!Array.isArray(filas) || filas.length < 5) throw new Error("respuesta vacía");
    return {
      datos: { anios: filas.map((f) => num(f.a_o)), matricula: filas.map((f) => Math.round(num(f.mat))) },
      origen: "en-vivo",
      consultado,
    };
  } catch (e) {
    console.warn("[datosgov] usando respaldo de matrícula:", (e as Error).message);
    return { datos: MATRICULA_OFICIAL_RESPALDO, origen: "respaldo", consultado };
  }
}
