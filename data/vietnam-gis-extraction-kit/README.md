# Vietnam GIS Extraction Kit

This directory integrates the Vietnam GIS extraction/template work into the AMap Multi-Engine Platform.

## Purpose

Provide a long-lived, provider-neutral master structure for Vietnam spatial data without coupling the platform to one vendor endpoint, binary format or proprietary dataset.

## Finding from AMap Global 17.00.0.2009

Static inspection of the XAPK found no embedded Vietnam GIS geometry dataset in GeoJSON, KML/KMZ, GPX, PBF/MVT, GeoPackage or Shapefile form.

The package mainly contains runtime engines, styles, navigation assets, configuration and offline-download/catalog logic. The included offline city catalog is China-oriented. Vietnam-specific evidence is limited to language/TTS resources, not map geometry.

Therefore this kit contains **templates and normalization tooling**, not copied commercial map geometry.

## Canonical layers

| Layer | Geometry | Typical content |
|---|---|---|
| `vn_points` | Point | POI, intersections, traffic signals, signs, cameras, toll gates, stations, chargers, sensors |
| `vn_lines` | LineString/MultiLineString | roads, lanes, rail, waterways, bus routes, navigation routes, infrastructure |
| `vn_polygons` | MultiPolygon | administrative boundaries, land use, water, buildings, industrial areas, protected areas |

Master CRS: **EPSG:4326**.

## Stable feature fields

Each imported feature should preserve:

`id`, `source`, `source_id`, `class`, `subclass`, `name`, `name_en`, `admin_level`, `road_class`, `oneway`, `speed_kph`, `valid_from`, `valid_to`, `confidence`, `license`, `source_version`, `updated_at`, `props_json`.

## Recommended architecture

```text
Source datasets
    ↓
04_tools/normalize_vectors.py
    ↓
vn_points / vn_lines / vn_polygons
    ↓
GeoPackage / PostGIS / VFM
    ↓
PMTiles / MVT
    ↓
MapLibre / application runtime
```

Traffic/realtime state should remain a temporal overlay keyed to stable road/object IDs rather than overwriting static topology.

## Files in this repository

```text
00_report/
01_evidence/
02_template_gis/
03_schemas/
04_tools/
05_provenance/
```

The complete original kit, including the generated GeoPackage and full evidence CSV inventories, is preserved at:

`artifacts/vietnam-gis/AMap_Vietnam_GIS_Extraction_Kit.zip`

## Rebuilding the GeoPackage

Install GeoPandas/Shapely, then normalize an input vector dataset:

```bash
python data/vietnam-gis-extraction-kit/04_tools/normalize_vectors.py input.gpkg output.gpkg --source my_source
```

Only use datasets and APIs whose licensing/authorization permits collection, transformation and redistribution.
