import type { Metadata } from "next";
import { Figtree, Unbounded } from "next/font/google";
import Link from "next/link";
import { SiteNav } from "@/components/SiteHeader";
import "./globals.css";

const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  title: { default: "InfoEdu Quibdó", template: "%s | InfoEdu Quibdó" },
  description:
    "Observatorio de la educación de Quibdó: indicadores oficiales de la Secretaría de Educación de Quibdó, Saber 11 y el caso para invertir en educación STEM.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${unbounded.variable} ${figtree.variable}`}>
      <body>
        <div className="shell">
          <SiteNav />
          <div className="main">
            <main className="page">{children}</main>
            <footer className="site-foot">
              <span>InfoEdu Quibdó, una iniciativa de la Escuela de Robótica del Chocó.</span>
              <Link href="/fuentes">Cómo obtenemos los datos</Link>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
