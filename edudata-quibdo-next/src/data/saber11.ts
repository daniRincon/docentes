import type { ResultadoColegio, SerieSaber11 } from "@/lib/types";

/**
 * Serie del puntaje global y de matemáticas (calendario A).
 * 2014–2022: ICFES datos abiertos (kgxf-xxbe), 2019* y 2022* agrupan aplicaciones.
 * 2023–2026: ICFES, Resultados para entidades territoriales (aplicaciones 20234, 20243, 20253, 20263).
 * 2026†: puntaje global municipal estimado con la ponderación oficial a partir de los promedios por prueba.
 */
export const SERIE_SABER11: SerieSaber11 = {
  "etiquetas": [
    "2014",
    "2015",
    "2016",
    "2017",
    "2019*",
    "2022*",
    "2023",
    "2024",
    "2025",
    "2026†"
  ],
  "globalQuibdo": [
    227.3,
    221.4,
    229.1,
    224.7,
    218.4,
    220.7,
    227,
    234,
    236,
    242
  ],
  "globalChoco": [
    218.9,
    215.8,
    220.0,
    215.4,
    200.7,
    206.1,
    null,
    null,
    null,
    218
  ],
  "globalColombia": [
    250.0,
    249.9,
    258.2,
    255.2,
    246.2,
    250.1,
    257,
    260,
    261,
    258
  ],
  "matematicasQuibdo": [
    45.13,
    43.09,
    44.0,
    43.21,
    44.81,
    44.17,
    46,
    47,
    47,
    47
  ],
  "matematicasColombia": [
    50.01,
    50.13,
    50.78,
    50.06,
    50.61,
    50.59,
    52,
    53,
    53,
    52
  ]
};

/** Promedios por prueba, aplicación 2026-3 (escala 0–100). */
export const AREAS_2026 = {
  pruebas: ["Matemáticas", "Ciencias naturales", "Inglés"],
  quibdo: [47, 48, 57],
  choco: [42, 44, 49],
  colombia: [52, 51, 53],
  evaluadosQuibdo: 1552,
} as const;

/** Resultados por colegio oficial, Saber 11 2022 (último año por colegio en datos abiertos). */
export const RESULTADOS_COLEGIOS_2022: ResultadoColegio[] = [
  {
    "nombre": "IE Femenina de Enseñanza Media",
    "zona": "Urbana",
    "evaluados": 302,
    "global": 262.9,
    "matematicas": 52.2
  },
  {
    "nombre": "IE Técnica Integrado Carrasquilla Industrial",
    "zona": "Urbana",
    "evaluados": 460,
    "global": 250.9,
    "matematicas": 51.9
  },
  {
    "nombre": "IE Antonio María Claret",
    "zona": "Urbana",
    "evaluados": 194,
    "global": 236.2,
    "matematicas": 46.7
  },
  {
    "nombre": "IE Gimnasio de Quibdó",
    "zona": "Urbana",
    "evaluados": 226,
    "global": 222.7,
    "matematicas": 43.6
  },
  {
    "nombre": "IE Santo Domingo de Guzmán",
    "zona": "Urbana",
    "evaluados": 32,
    "global": 222.3,
    "matematicas": 44.9
  },
  {
    "nombre": "IE Normal Superior Manuel Cañizalez",
    "zona": "Urbana",
    "evaluados": 212,
    "global": 221.0,
    "matematicas": 44.1
  },
  {
    "nombre": "IE MIA Rogerio Velásquez Murillo",
    "zona": "Urbana",
    "evaluados": 154,
    "global": 214.5,
    "matematicas": 43.6
  },
  {
    "nombre": "IE Normal Superior de Quibdó",
    "zona": "Urbana",
    "evaluados": 270,
    "global": 212.6,
    "matematicas": 43.7
  },
  {
    "nombre": "IE Santo Domingo Savio",
    "zona": "Urbana",
    "evaluados": 148,
    "global": 205.8,
    "matematicas": 40.6
  },
  {
    "nombre": "IE Antonio Ricaurte",
    "zona": "Urbana",
    "evaluados": 84,
    "global": 203.2,
    "matematicas": 40.0
  },
  {
    "nombre": "IE Diocesano Pedro Grau y Arola",
    "zona": "Urbana",
    "evaluados": 152,
    "global": 203.0,
    "matematicas": 41.8
  },
  {
    "nombre": "IE MIA Jorge Valencia Lozano",
    "zona": "Urbana",
    "evaluados": 22,
    "global": 202.1,
    "matematicas": 41.0
  },
  {
    "nombre": "IE Manuel Agustín Santacoloma Villa",
    "zona": "Urbana",
    "evaluados": 168,
    "global": 201.2,
    "matematicas": 39.9
  },
  {
    "nombre": "IE Isaac Rodríguez Martínez",
    "zona": "Urbana",
    "evaluados": 66,
    "global": 197.0,
    "matematicas": 39.8
  },
  {
    "nombre": "IE José del Carmen Cuesta Rentería",
    "zona": "Urbana",
    "evaluados": 160,
    "global": 196.7,
    "matematicas": 38.6
  },
  {
    "nombre": "IE Miguel Antonio Caicedo Mena - Obapó",
    "zona": "Urbana",
    "evaluados": 124,
    "global": 194.0,
    "matematicas": 37.5
  },
  {
    "nombre": "IE Armando Luna Roa",
    "zona": "Urbana",
    "evaluados": 152,
    "global": 190.6,
    "matematicas": 36.8
  },
  {
    "nombre": "IE Agropecuaria de Tagachí",
    "zona": "Rural",
    "evaluados": 22,
    "global": 188.5,
    "matematicas": 35.3
  },
  {
    "nombre": "IE Agropecuaria Cristo Rey de Tutunendo",
    "zona": "Rural",
    "evaluados": 64,
    "global": 187.3,
    "matematicas": 37.9
  }
];

/** Último puntaje global municipal publicado por el ICFES (aplicación 2025-3, todos los sectores). */
export const SABER11_MUNICIPIO_ULTIMO = { anio: 2025, global: 236, colombia: 261 } as const;
