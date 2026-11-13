"use client";

import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { fmt } from "@/lib/format";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

/* Paleta de series (coincide con los tokens de globals.css). */
export const COLORES = {
  quibdo: "#0E7C86",
  choco: "#E9A923",
  colombia: "#8C9A96",
  verde: "#3E9B6E",
  malo: "#B5452B",
} as const;

const TINTA = "#15241F";
const SUAVE = "#5D6D67";
const LINEA = "#E6ECE9";
const FUENTE = "Figtree, system-ui, sans-serif";

export interface Serie {
  label: string;
  data: (number | null)[];
  color: string;
  grosor?: number;
  punteada?: boolean;
  unirHuecos?: boolean;
}

function opciones(min?: number, max?: number, sufijo = "", leyenda = true, apilado = false, entero = false): ChartOptions<"line" | "bar"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: leyenda, position: "bottom", labels: { color: TINTA, usePointStyle: true, boxWidth: 10, boxHeight: 10, padding: 14, font: { family: FUENTE, weight: 600 } } },
      tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${fmt(c.parsed.y as number, entero ? 0 : 1)}${sufijo}` } },
    },
    scales: {
      x: { stacked: apilado, grid: { display: false }, ticks: { color: SUAVE, font: { family: FUENTE } } },
      y: { stacked: apilado, min, max, grid: { color: LINEA }, border: { display: false }, ticks: { color: SUAVE, padding: 8, font: { family: FUENTE }, callback: (v) => fmt(Number(v)) + sufijo } },
    },
  };
}

export function LineChart({ labels, series, min, max, sufijo, alto = 300, ariaLabel }: { labels: (string | number)[]; series: Serie[]; min?: number; max?: number; sufijo?: string; alto?: number; ariaLabel: string }) {
  return (
    <div className="chart" style={{ height: alto }}>
      <Line
        aria-label={ariaLabel}
        role="img"
        data={{
          labels,
          datasets: series.map((s) => ({
            label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.color, borderWidth: s.grosor ?? 2.5,
            borderDash: s.punteada ? [5, 4] : undefined, spanGaps: s.unirHuecos ?? false, pointRadius: 2.5, pointHoverRadius: 5, tension: 0.25,
          })),
        }}
        options={opciones(min, max, sufijo) as ChartOptions<"line">}
      />
    </div>
  );
}

export function BarChart({ labels, series, min, max, sufijo, leyenda = true, entero, ariaLabel, coloresPorBarra }: { labels: (string | number)[]; series: Serie[]; min?: number; max?: number; sufijo?: string; leyenda?: boolean; entero?: boolean; ariaLabel: string; coloresPorBarra?: string[] }) {
  return (
    <div className="chart">
      <Bar
        aria-label={ariaLabel}
        role="img"
        data={{
          labels,
          datasets: series.map((s) => ({ label: s.label, data: s.data, backgroundColor: coloresPorBarra ?? s.color, borderRadius: 5 })),
        }}
        options={opciones(min, max, sufijo, leyenda, false, entero) as ChartOptions<"bar">}
      />
    </div>
  );
}

export function DoughnutChart({ labels, data, colores, ariaLabel }: { labels: string[]; data: number[]; colores: string[]; ariaLabel: string }) {
  return (
    <div className="chart">
      <Doughnut
        aria-label={ariaLabel}
        role="img"
        data={{ labels, datasets: [{ data, backgroundColor: colores, borderColor: "#fff", borderWidth: 2 }] }}
        options={{ responsive: true, maintainAspectRatio: false, cutout: "58%", plugins: { legend: { position: "bottom", labels: { color: TINTA, usePointStyle: true, boxWidth: 10, font: { family: FUENTE, weight: 600 } } } } }}
      />
    </div>
  );
}
