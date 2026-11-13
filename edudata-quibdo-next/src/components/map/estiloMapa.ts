/**
 * Estilo del mapa de Quibdó (inspirado en @react-map/colombia):
 * relleno plano, bordes blancos finos, realce al pasar el mouse y color de selección.
 */
export const ESTILO_MAPA = {
  fondo: "#FFFFFF",
  municipio: "#D5DFDA",
  urbano: "#B3CDBE",
  rio: "#9CC3CC",
  borde: "#FFFFFF",
  grosorBorde: 0.8,
  realce: "#0E7C86",      // hoverColor
  seleccion: "#0F3B32",   // selectColor
  otrasSedes: "#8C9A96",
} as const;

/** Color de cada tipo de institución, como los colores por región del mapa de Colombia. */
export const COLOR_TIPO: Record<string, string> = {
  "IE urbana": "#5E9C86",
  "IE agropecuaria rural": "#E9A923",
  "Centro educativo indígena": "#C9774A",
  "Centro educativo": "#7FB2C2",
};
