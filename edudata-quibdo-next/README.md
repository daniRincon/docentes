# InfoEdu Quibdó (Next.js)

Observatorio de la Educación de Quibdó: indicadores oficiales de la Secretaría de Educación de Quibdó,
resultados Saber 11 y el caso para invertir en educación STEM. Lo mantiene la Escuela de Robótica del Chocó.

## Cómo correrlo

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # compila para producción
npm run start      # sirve la versión compilada
```

Requiere Node 20 o superior.

## Arquitectura

```
src/
├─ app/                      Rutas (App Router). Cada carpeta es una página.
│  ├─ layout.tsx             Cabecera, pie y fuente Quicksand
│  ├─ page.tsx               Inicio: héroe, módulos y mapa interactivo
│  ├─ establecimientos/      Instituciones oficiales, matrícula y directorio
│  ├─ estudiantes/           Cobertura, deserción y reprobación
│  ├─ saber-11/              Puntajes Saber 11 y resultados por colegio
│  ├─ invertir-en-stem/      Caso para donantes
│  ├─ fuentes/               Fuentes y notas metodológicas
│  └─ globals.css            Estilos y tokens de color
├─ components/
│  ├─ SiteHeader.tsx         Menú (cliente: marca la página activa)
│  ├─ ModulesAccordion.tsx   Tarjetas de módulos que se despliegan (cliente)
│  ├─ Charts.tsx             Gráficos de línea, barras y dona con Chart.js (cliente)
│  ├─ InstitucionesTable.tsx Directorio con buscador (cliente)
│  ├─ CopyLinkButton.tsx     Botón "Copiar enlace" (cliente)
│  ├─ ui.tsx                 Piezas de servidor: Kpi, ViewHead, Card, CompareBars, Origen
│  └─ map/
│     ├─ MapExplorer.tsx     Filtros, panel lateral y leyenda (cliente)
│     └─ LeafletMap.tsx      Mapa con react-leaflet; se carga solo en el navegador
├─ data/                     Datos versionados (respaldo y cargas manuales)
│  ├─ indicadores.ts         Respaldo MEN y comparación con otras ciudades
│  ├─ instituciones.ts       25 instituciones oficiales con su ubicación
│  ├─ saber11.ts             Serie Saber 11, áreas 2026 y resultados por colegio
│  └─ geo.json               Capas del mapa (límite, casco urbano, ríos, vías, escuelas OSM)
└─ lib/
   ├─ datosgov.ts            Cliente de datos.gov.co (solo servidor)
   ├─ types.ts               Tipos compartidos
   └─ format.ts              Formato de números en español de Colombia
```

### Flujo de datos

| Dato | Fuente | Cómo se actualiza |
|---|---|---|
| Cobertura, deserción, reprobación | MEN, datos.gov.co `nudc-7mev` | **Automático.** Se consulta en el servidor y se guarda 24 h (`revalidate = 86400`). Si la API falla se usa `data/indicadores.ts`. |
| Matrícula oficial por año | MEN, datos.gov.co `cfw5-qzt5` | **Automático**, igual que el anterior. |
| Directorio y ubicación de instituciones | MEN `cfw5-qzt5` + OpenStreetMap | Manual: editar `data/instituciones.ts`. |
| Saber 11 2014–2022 y por colegio | ICFES, datos.gov.co `kgxf-xxbe` | Manual: `data/saber11.ts`. |
| Saber 11 2023 en adelante | ICFES, Resultados para entidades territoriales | Manual: el portal del ICFES no tiene API. Agregar cada año en `data/saber11.ts`. |
| Capas del mapa | OpenStreetMap (Overpass) | Manual: regenerar `data/geo.json`. |

Cada página que usa datos en vivo muestra si vinieron de datos.gov.co o de la copia guardada
(componente `Origen`).

### Decisiones

- **Server Components por defecto.** Solo son de cliente las piezas interactivas (mapa, gráficos,
  buscador, menú, acordeón). El HTML llega ya con las cifras, lo que ayuda a buscadores y a enlaces compartidos.
- **ISR de 24 h** en vez de consultar en cada visita: datos.gov.co es lento y el MEN publica una vez al año.
- **Respaldo local** para que la página nunca quede vacía si datos.gov.co no responde.
- **Mapa sin teselas externas.** Se dibuja con las capas de `geo.json`; así no depende de un proveedor de mapas.
- **Solo instituciones oficiales.** Los indicadores del MEN y el promedio Saber 11 municipal incluyen
  todos los sectores porque así se publican; la página lo aclara.

## Actualizar Saber 11 cada año

1. Abrir la consulta del ICFES: Resultados para entidades territoriales.
2. Aplicación `AAAA-3` (calendario A), Grado 11°, Municipio, Chocó, Quibdó. Repetir con Departamento, Chocó.
3. Agregar la etiqueta y los promedios en `SERIE_SABER11` y `AREAS_AAAA` de `src/data/saber11.ts`.
4. Si el ICFES no publica el puntaje global municipal, estimarlo:
   `5 × (3·lectura + 3·matemáticas + 3·sociales + 3·ciencias + inglés) / 13`.

## Despliegue

Pensado para Vercel (o cualquier hosting con Node). No necesita variables de entorno.
