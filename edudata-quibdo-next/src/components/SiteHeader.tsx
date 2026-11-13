"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const RUTAS = [
  { href: "/", label: "Inicio" },
  { href: "/#mapa", label: "Mapa" },
  { href: "/establecimientos", label: "Instituciones" },
  { href: "/estudiantes", label: "Estudiantes" },
  { href: "/saber-11", label: "Saber 11" },
  { href: "/fuentes", label: "Fuentes" },
];

/** Barra lateral fija en escritorio; barra superior desplazable en móvil. */
export function SiteNav() {
  const pathname = usePathname();
  return (
    <aside className="side-nav">
      <Link className="nav-brand" href="/">
        <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
          <rect width="36" height="36" rx="10" fill="#17503F" />
          <path d="M11 4c3 6-4 9-1 15s9 5 6 13" stroke="#5FB7BE" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="13" r="3" fill="#E9A923" />
        </svg>
        <span>
          <b>InfoEdu Quibdó</b>
          <small>Observatorio de la educación</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label="Secciones">
        {RUTAS.map((r) => (
          <Link key={r.href} href={r.href} aria-current={pathname === r.href ? "page" : undefined}>
            {r.label}
          </Link>
        ))}
        <Link className="cta" href="/invertir-en-stem" aria-current={pathname === "/invertir-en-stem" ? "page" : undefined}>
          Invertir en STEM
        </Link>
      </nav>
      <div className="nav-foot">
        <b>Escuela de Robótica del Chocó</b>
        Datos abiertos del MEN y el ICFES
      </div>
    </aside>
  );
}
