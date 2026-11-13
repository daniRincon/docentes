"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TarjetaSeccion {
  href: string;
  titulo: string;
  texto: string;
  fig: string;
  figTexto: string;
  cta: string;
  destacada?: boolean;
}

/** Tarjetas de secciones en una fila que se desplaza (dedo, rueda o flechas). */
export function SectionCarousel({ tarjetas }: { tarjetas: TarjetaSeccion[] }) {
  const pista = useRef<HTMLDivElement>(null);
  const [puede, setPuede] = useState({ atras: false, adelante: true });

  const actualizar = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPuede({ atras: el.scrollLeft > 4, adelante: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    actualizar();
    window.addEventListener("resize", actualizar);
    return () => window.removeEventListener("resize", actualizar);
  }, [actualizar]);

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const tarjeta = el.querySelector<HTMLElement>(".sc-card");
    el.scrollBy({ left: dir * ((tarjeta?.offsetWidth ?? 300) + 16), behavior: "smooth" });
  };

  return (
    <section className="sc" aria-label="Secciones de la plataforma">
      <div className="sc-head">
        <h2>Explora los datos</h2>
        <div className="sc-flechas">
          <button type="button" onClick={() => mover(-1)} disabled={!puede.atras} aria-label="Ver tarjetas anteriores">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" onClick={() => mover(1)} disabled={!puede.adelante} aria-label="Ver más tarjetas">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
      <div className="sc-pista" ref={pista} onScroll={actualizar} tabIndex={0}>
        {tarjetas.map((t) => (
          <Link key={t.href} href={t.href} className={`sc-card${t.destacada ? " destacada" : ""}`}>
            <div className="sc-fig">
              <b>{t.fig}</b>
              <span>{t.figTexto}</span>
            </div>
            <div className="sc-body">
              <h3>{t.titulo}</h3>
              <p>{t.texto}</p>
            </div>
            <span className="sc-ir">{t.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
