import type { SerieIndicadores } from "@/lib/types";

/**
 * Respaldo local de las estadísticas MEN por municipio (dataset nudc-7mev, código 27001).
 * La app consulta datos.gov.co en vivo (ver src/lib/datosgov.ts) y usa esto si la consulta falla.
 */
export const INDICADORES_RESPALDO: SerieIndicadores = {
  "anios": [
    2011,
    2012,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2022,
    2023,
    2024
  ],
  "coberturaTransicion": [
    66.8,
    78.1,
    74.3,
    66.82,
    67.79,
    64.25,
    73.15,
    76.22,
    76.41,
    74.37,
    75.84,
    74.37,
    66.77
  ],
  "coberturaPrimaria": [
    96.3,
    94.9,
    89.6,
    74.69,
    94.36,
    94.63,
    92.06,
    96.7,
    103.64,
    106.95,
    104.12,
    102,
    100.38
  ],
  "coberturaSecundaria": [
    69.7,
    70.2,
    70.9,
    68.49,
    75.39,
    73.77,
    72.19,
    78.15,
    81.29,
    84.33,
    79.37,
    79.05,
    80.04
  ],
  "coberturaMedia": [
    40,
    36.5,
    33.5,
    37.97,
    38.61,
    43.38,
    38.78,
    40.12,
    40.5,
    44.7,
    45.72,
    45.24,
    45.12
  ],
  "desercion": [
    6.27,
    2.64,
    3.6,
    2.29,
    1.8,
    1.09,
    1.13,
    1.03,
    1.81,
    0.71,
    1.76,
    1.82,
    1.38
  ],
  "reprobacion": [
    8.1,
    7.46,
    7.58,
    6.31,
    5.63,
    9.75,
    9.88,
    9.8,
    9.72,
    4.1,
    5.73,
    8.54,
    6.3
  ],
  "reprobacionSecundaria": [
    12.24,
    12.23,
    11.17,
    9.86,
    7.47,
    15.95,
    15.72,
    15.61,
    15,
    5.21,
    9.37,
    13.68,
    7.47
  ]
};

/** Matrícula oficial reportada por las instituciones (dataset cfw5-qzt5). Respaldo local. */
export const MATRICULA_OFICIAL_RESPALDO = {
  "anios": [
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024,
    2025
  ],
  "matricula": [
    36570,
    35257,
    33665,
    34206,
    35593,
    36082,
    35552,
    35181,
    33967,
    32867,
    32748
  ]
};

/** Comparación con otras secretarías, 2024 (MEN, nudc-7mev). */
export const COMPARADORES_2024 = {
  coberturaMedia: [
    { nombre: "Bogotá", valor: 65.32 },
    { nombre: "Medellín", valor: 56.7 },
    { nombre: "Cali", valor: 48.83 },
    { nombre: "Quibdó", valor: 45.12, propio: true },
  ],
  desercion: [
    { nombre: "Cali", valor: 4.41 },
    { nombre: "Medellín", valor: 3.18 },
    { nombre: "Bogotá", valor: 2.49 },
    { nombre: "Quibdó", valor: 1.38, propio: true },
  ],
};
