export const fmt = (n: number, decimales = 0) =>
  n.toLocaleString("es-CO", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });

export const pct = (n: number, decimales = 1) => `${fmt(n, decimales)}%`;
