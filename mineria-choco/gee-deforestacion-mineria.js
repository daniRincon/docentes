// =====================================================================
//  Deforestación asociada a minería aluvial en el Chocó
//  Script para Google Earth Engine (https://code.earthengine.google.com)
//
//  Qué hace:
//   1. Arma dos mosaicos Sentinel-2 sin nubes: ANTES y DESPUÉS.
//   2. Marca los píxeles que eran bosque ANTES y hoy son suelo desnudo
//      o agua (piscinas) DESPUÉS = pérdida de bosque probable por minería.
//   3. Excluye el cauce permanente de los ríos (datos JRC).
//   4. Calcula el área perdida en hectáreas y la muestra en la consola.
//
//  Cómo cambiar la zona: borre la línea "var zona = ..." y dibuje un
//  rectángulo con la herramienta de geometría del mapa; llámelo "zona".
// =====================================================================

// ---------------- CONFIGURACIÓN ----------------
// Zona aproximada del río Quito (Paimadó - San Isidro). Ajuste a su gusto.
var zona = ee.Geometry.Rectangle([-76.85, 5.35, -76.60, 5.65]);

var ANTES_INICIO = '2019-01-01';
var ANTES_FIN = '2019-12-31';
var DESPUES_INICIO = '2025-11-01';
var DESPUES_FIN = '2026-11-01';

var NDVI_BOSQUE = 0.70;      // NDVI mínimo para considerar "bosque" antes
var NDVI_SIN_VEG = 0.35;     // NDVI máximo para "sin vegetación" después
var AGUA_PERMANENTE = 50;    // % de ocurrencia de agua JRC para excluir ríos
var UMBRAL_CIELO = 0.60;     // Cloud Score+: 0 nublado ... 1 despejado

// ---------------- FUNCIONES ----------------
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED');
var cloudScore = ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');

function mosaicoSinNubes(inicio, fin) {
  return s2.filterBounds(zona)
    .filterDate(inicio, fin)
    .linkCollection(cloudScore, ['cs_cdf'])
    .map(function (img) {
      var despejado = img.select('cs_cdf').gte(UMBRAL_CIELO);
      return img.select(['B2', 'B3', 'B4', 'B8', 'B11'])
        .divide(10000)
        .updateMask(despejado);
    })
    .median()
    .clip(zona);
}

function agregarIndices(img) {
  var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI');
  return img.addBands([ndvi, ndwi]);
}

// ---------------- CÁLCULO ----------------
var antes = agregarIndices(mosaicoSinNubes(ANTES_INICIO, ANTES_FIN));
var despues = agregarIndices(mosaicoSinNubes(DESPUES_INICIO, DESPUES_FIN));

var eraBosque = antes.select('NDVI').gte(NDVI_BOSQUE);
var hoySinVegetacion = despues.select('NDVI').lte(NDVI_SIN_VEG);

// Excluir el cauce permanente de los ríos
var aguaJRC = ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence').unmask(0);
var noEsRio = aguaJRC.lt(AGUA_PERMANENTE);

var perdida = eraBosque.and(hoySinVegetacion).and(noEsRio).selfMask().rename('perdida');

// Separar: piscinas (agua nueva) vs suelo desnudo
var piscinas = perdida.updateMask(despues.select('NDWI').gt(0));
var sueloDesnudo = perdida.updateMask(despues.select('NDWI').lte(0));

// ---------------- ÁREAS ----------------
function hectareas(mascara, nombre) {
  var area = mascara.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: zona,
    scale: 10,
    maxPixels: 1e10
  }).values().get(0);
  print(nombre + ' (ha):', ee.Number(area).divide(10000).format('%.1f'));
}

print('Zona analizada (ha):', zona.area(1).divide(10000).format('%.0f'));
hectareas(perdida, 'Bosque perdido total');
hectareas(sueloDesnudo, '  - convertido en suelo desnudo');
hectareas(piscinas, '  - convertido en piscinas / agua');

// ---------------- MAPA ----------------
Map.centerObject(zona, 12);
Map.setOptions('SATELLITE');

var visColor = { bands: ['B4', 'B3', 'B2'], min: 0, max: 0.15 };
var visFalso = { bands: ['B8', 'B4', 'B3'], min: 0, max: 0.4 };

Map.addLayer(antes, visColor, 'ANTES - color real (' + ANTES_INICIO.slice(0, 4) + ')', false);
Map.addLayer(despues, visColor, 'DESPUÉS - color real', true);
Map.addLayer(despues, visFalso, 'DESPUÉS - falso color (bosque en rojo)', false);
Map.addLayer(sueloDesnudo, { palette: ['ff0000'] }, 'Pérdida: suelo desnudo (rojo)');
Map.addLayer(piscinas, { palette: ['ff9900'] }, 'Pérdida: piscinas (naranja)');
Map.addLayer(ee.Image().paint(zona, 0, 2), { palette: ['ffffff'] }, 'Zona de estudio');

// ---------------- LEYENDA ----------------
var leyenda = ui.Panel({ style: { position: 'bottom-left', padding: '8px' } });
leyenda.add(ui.Label('Pérdida de bosque ' + ANTES_INICIO.slice(0, 4) + ' → hoy',
  { fontWeight: 'bold' }));
[['ff0000', 'Suelo desnudo / arena'], ['ff9900', 'Piscinas / agua nueva']]
  .forEach(function (item) {
    leyenda.add(ui.Panel([
      ui.Label('', { backgroundColor: '#' + item[0], padding: '8px', margin: '0 6px 0 0' }),
      ui.Label(item[1], { margin: '0' })
    ], ui.Panel.Layout.Flow('horizontal')));
  });
Map.add(leyenda);

// ---------------- EXPORTAR (opcional) ----------------
// Quite los "//" para guardar la capa de pérdida en su Google Drive como GeoTIFF,
// o como polígonos KML para abrir en Google Earth Pro.
//
// Export.image.toDrive({
//   image: perdida.unmask(0).toByte(),
//   description: 'perdida_bosque_mineria',
//   region: zona, scale: 10, maxPixels: 1e10
// });
//
// Export.table.toDrive({
//   collection: perdida.reduceToVectors({
//     geometry: zona, scale: 10, maxPixels: 1e10, geometryType: 'polygon'
//   }),
//   description: 'poligonos_mineria', fileFormat: 'KML'
// });
