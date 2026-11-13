export type PrecisionUbicacion = "sede" | "aproximada";

export interface Institucion {
  nombre: string;
  barrio: string;
  sedes: number;
  matricula: number;
  tipo: string;
  /** Promedio del colegio en Saber 11 2022; null si no presentó o no ofrece media. */
  saber11Global2022: number | null;
  ubicacion: { lat: number; lon: number; precision: PrecisionUbicacion } | null;
}

export interface SerieIndicadores {
  anios: number[];
  coberturaTransicion: number[];
  coberturaPrimaria: number[];
  coberturaSecundaria: number[];
  coberturaMedia: number[];
  desercion: number[];
  reprobacion: number[];
  reprobacionSecundaria: number[];
}

export interface UltimoAnio {
  anio: number;
  coberturaBruta: number;
  coberturaNeta: number;
  coberturaMedia: number;
  desercion: number;
  reprobacion: number;
  reprobacionSecundaria: number;
  poblacion5a16: number;
}

export interface SerieSaber11 {
  etiquetas: string[];
  globalQuibdo: (number | null)[];
  globalChoco: (number | null)[];
  globalColombia: (number | null)[];
  matematicasQuibdo: number[];
  matematicasColombia: number[];
}

export interface ResultadoColegio {
  nombre: string;
  zona: string;
  evaluados: number;
  global: number;
  matematicas: number;
}

/** Indica si un dato vino de la API en vivo o del respaldo local versionado. */
export interface ConOrigen<T> {
  datos: T;
  origen: "en-vivo" | "respaldo";
  consultado: string;
}

export interface GeoCapas {
  muni: [number, number][][];
  urban: [number, number][][];
  rivers: { n: string; a: 0 | 1; c: [number, number][] }[];
  roads: { h: string; c: [number, number][] }[];
  osm: [number, number, string][];
}
