# Evidence summary

The full raw evidence inventories are preserved in the archived kit:

`artifacts/vietnam-gis/AMap_Vietnam_GIS_Extraction_Kit.zip`

Key observations:

- no explicit embedded GeoJSON/KML/KMZ/GPX/PBF/MVT/GPKG/Shapefile dataset was found in the base APK;
- the offline city SQLite catalog contains 395 entries and produced no Vietnam matches;
- the compiled city configuration contains 34 province-level groups aligned with China/HK/Macau administration;
- Vietnam-specific static mentions are voice/TTS related and contain no geometry;
- no embedded Vietnam Point/Line/Polygon master dataset was identified.

This repository intentionally does not turn undocumented/private provider endpoints into a data dependency.
