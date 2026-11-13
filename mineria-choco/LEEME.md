# Scripts para ver la deforestación por minería en el Chocó

## 1. `evalscript-mineria-sentinel2.js` — Copernicus Browser (rápido, sin programar)

Colorea una imagen Sentinel-2 para resaltar las zonas afectadas.

1. Entre a https://browser.dataspace.copernicus.eu e inicie sesión.
2. Busque la zona (ej. "Paimadó") y elija **Sentinel-2 L2A**, con poca nubosidad.
3. En la lista de capas, al final, elija **Custom** → pestaña **Custom script**.
4. Borre lo que haya, pegue todo el contenido del archivo y pulse **Apply**.

| Color | Significado |
|---|---|
| Rojo | Suelo desnudo, arena, cascajo (bosque arrasado) |
| Naranja | Agua turbia con sedimento (piscinas, ríos afectados) |
| Azul | Agua más limpia |
| Amarillo | Vegetación degradada o rastrojo |
| Verde | Bosque |
| Gris | Nubes (sin dato) |

Los pueblos, carreteras y playas naturales también salen en rojo: compare siempre con la capa **True color**.

## 2. `gee-deforestacion-mineria.js` — Google Earth Engine (antes vs. después, con hectáreas)

Compara 2019 con el último año y marca el bosque que se convirtió en suelo desnudo o piscinas. Calcula las hectáreas perdidas.

1. Registre su cuenta gratis (uso educativo o no comercial) en https://earthengine.google.com.
2. Abra https://code.earthengine.google.com.
3. Pegue el script en el editor del centro y pulse **Run**.
4. Las hectáreas aparecen en la pestaña **Console** (derecha) y el mapa abajo.
5. Para cambiar la zona o las fechas, edite la sección **CONFIGURACIÓN** al inicio.

La zona por defecto es aproximada (río Quito). Verifique que el rectángulo blanco cubra lo que quiere estudiar.

## Advertencias

- Los umbrales son un punto de partida: ajústelos si ve demasiado o muy poco resaltado.
- El Chocó es muy nublado: si el mapa sale con huecos, amplíe el rango de fechas.
- El resultado indica **deforestación probable**, no prueba que sea minería. Hay que confirmarlo mirando la imagen (piscinas en fila, cauce alterado) y con fuentes oficiales como el informe EVOA de UNODC/SIMCI.
