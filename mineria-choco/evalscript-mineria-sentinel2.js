//VERSION=3
// =====================================================================
//  Resaltado de posibles zonas de minería aluvial - Sentinel-2 L2A
//  Para pegar en Copernicus Browser -> capa "Custom" -> "Custom script"
//
//  Leyenda:
//    ROJO      suelo desnudo / arena / cascajo (bosque arrasado)
//    NARANJA   agua turbia, cargada de sedimento (piscinas, ríos afectados)
//    AZUL      agua más limpia
//    AMARILLO  vegetación degradada o rastrojo (posible recuperación o borde)
//    VERDE     bosque (atenuado para que resalten las zonas afectadas)
//    GRIS      nubes o sombras de nubes (sin dato)
//
//  Nota: los cascos urbanos, carreteras y playas naturales del río
//  también salen en rojo. Hay que interpretar con la imagen en color real.
// =====================================================================

// ---- Umbrales (ajústelos si ve demasiado o muy poco resaltado) ----
var UMBRAL_AGUA = 0.10;        // NDWI por encima de esto = agua
var UMBRAL_TURBIDEZ = 0.90;    // B04/B03 por encima = agua turbia
var UMBRAL_SUELO_BSI = 0.05;   // índice de suelo desnudo
var UMBRAL_SUELO_NDVI = 0.30;  // NDVI por debajo = sin vegetación
var UMBRAL_DEGRADADO = 0.55;   // NDVI por debajo = vegetación degradada
var GANANCIA = 2.5;            // brillo del fondo

function setup() {
  return {
    input: [{ bands: ["B02", "B03", "B04", "B08", "B11", "SCL", "dataMask"] }],
    output: { bands: 4 }
  };
}

// Clases de nubes en la banda SCL: 3 sombra, 8 y 9 nubes, 10 cirros
var CLASES_NUBE = [3, 8, 9, 10];

function evaluatePixel(s) {
  if (s.dataMask === 0) return [0, 0, 0, 0];
  if (CLASES_NUBE.indexOf(s.SCL) !== -1) return [0.8, 0.8, 0.8, 1];

  var ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
  var ndwi = (s.B03 - s.B08) / (s.B03 + s.B08);
  var bsi = ((s.B11 + s.B04) - (s.B08 + s.B02)) /
            ((s.B11 + s.B04) + (s.B08 + s.B02));

  // Agua: separar turbia (sedimentos de minería) de más limpia
  if (ndwi > UMBRAL_AGUA) {
    if (s.B04 / s.B03 > UMBRAL_TURBIDEZ) return [1, 0.55, 0, 1]; // naranja
    return [0, 0.55, 1, 1];                                       // azul
  }

  // Suelo desnudo / arena / cascajo
  if (bsi > UMBRAL_SUELO_BSI && ndvi < UMBRAL_SUELO_NDVI) return [1, 0, 0, 1];

  // Vegetación degradada o rastrojo
  if (ndvi < UMBRAL_DEGRADADO) return [1, 0.9, 0, 1];

  // Bosque: verde apagado sobre la imagen real
  var brillo = (s.B04 + s.B03 + s.B02) / 3 * GANANCIA;
  return [brillo * 0.5, brillo * 0.9 + 0.1, brillo * 0.5, 1];
}
