# AMap Multi-Engine Platform

Provider-neutral, clean-room framework for WebGIS, navigation, ADAS, robotics and spatial world-model applications.

This repository uses the capability layout seen in `Base27-CVNSS/gaode-map` as a reference for **what a complete mapping SDK needs**, then reorganizes those capabilities into a long-lived multi-engine platform rather than a single React Native SDK.

## Status

- Architecture version: **0.2.0**
- Engines: **20**
- Language: TypeScript reference core
- CI: typecheck + build + smoke test
- Design: provider-neutral / clean-room
- Endpoint rule: no vendor hostname inside domain engines

## Architecture

```text
Application / WebGIS / Mobile / Navigation / ADAS / Robot
                         │
                Runtime + Capability API
                         │
                    Engine Registry
                         │
┌────────────────────────┼───────────────────────────┐
│ Map / Overlay / Search / Road / Lane / Traffic   │
│ Signal / Sign / Routing / Navigation / Position  │
│ Perception / Offline / Geometry / Algorithms     │
│ Storage / Network / Policy / Observability       │
└────────────────────────┼───────────────────────────┘
                         │
                  Provider Contracts
                         │
                  Provider Adapters
                         │
             Endpoint Registry + HTTP Client
                         │
             licensed/open external systems
```

## 20 engines

| Engine | Responsibility |
|---|---|
| Storage | SQL/KV/binary/cache abstractions |
| Network | endpoint resolution, timeout, retry, transport |
| Algorithms | graph, sequence, filtering and ML primitives |
| Geometry | coordinates, distance, bounds, geometry utilities |
| Road | road graph, topology, restrictions, static attributes |
| Lane | lane geometry, connectivity, lane-level matching |
| Map | renderer, tiles, styles, labels and camera |
| Overlay | marker, polyline, polygon, circle, heatmap, cluster |
| Search | geocode, reverse geocode, POI, nearby, input tips |
| Traffic | realtime state, congestion, incidents, travel time |
| Signal | signal groups, phases, movement and realtime state |
| Sign | road signs, speed limits, cameras and facilities |
| Positioning | GNSS/RTK/IMU/VDR fusion and map/lane matching |
| Routing | driving/walking/cycling/transit route planning |
| Navigation | route following, reroute, progress and guidance |
| Perception | lane/light/sign perception, VIO/SLAM and depth |
| Offline | package catalog, download, update, delete and cache |
| Policy | privacy, consent, permission and capability gating |
| Observability | diagnostics, health, logs and metrics |
| Runtime | plugin lifecycle and platform/native/web bridge |

## What was added from the gaode-map capability review

The reference repository exposes useful capability families such as:

- map view + overlays
- offline map management
- permission/platform diagnostics
- geocode / POI / input tips
- route planning and web fallback
- route geometry and route following
- error handling, caching and retry
- example catalog and runtime gating

AMap 0.2.0 promotes these into provider-neutral contracts under `src/`, so the architecture can support MapLibre/PMTiles/OSM, custom services, licensed commercial APIs, mobile-native adapters or VFM data without changing the domain core.

## Core rule

```text
Domain Engine
   -> Capability Contract
      -> Provider Adapter
         -> Endpoint Registry
            -> Network Client
```

A provider can be replaced without rewriting Road, Lane, Signal, Sign, Search, Routing or Navigation models.

## Key folders

```text
src/
  core/            lifecycle, engine registry, capability types
  cache/           generic LRU cache
  network/         endpoint registry + resilient HTTP client
  geometry/        provider-neutral geospatial utilities
  map/             overlay canonical model
  search/          geocode/POI/input-tip contracts + service
  routing/         route contracts
  navigation/      route playback / progress
  offline/         offline package lifecycle
  policy/          privacy and permission abstractions
  runtime/         platform detection and runtime gates
  diagnostics/     platform health snapshot
  providers/       provider contracts and registry
  engines/         engine catalog
schemas/           canonical JSON schemas
config/            deployment configuration examples
docs/              architecture, mapping, provider and lifecycle guides
research/          static architectural observations only
examples/          runnable composition examples
tests/             smoke conformance tests
```

## Development

```bash
npm install
npm run check
npm test
```

## Clean-room scope

This repository does **not** include copied proprietary APK/XAPK binaries, DEX/native code, bundled commercial map data, private API keys, private signing logic or proprietary ML model weights.

See `docs/CLEAN_ROOM_POLICY.md`.

## Vietnam GIS Extraction Kit

A reproducible Vietnam-oriented GIS extraction/template kit is maintained under:

`data/vietnam-gis-extraction-kit/`

The complete archived kit is also retained at:

`artifacts/vietnam-gis/AMap_Vietnam_GIS_Extraction_Kit.zip`

The kit defines three provider-neutral canonical geometry layers in **EPSG:4326**:

- `vn_points` — POI, intersections, signals, signs, cameras, stations, sensors and other point objects.
- `vn_lines` — roads, lanes, railways, waterways, routes and linear infrastructure.
- `vn_polygons` — administrative boundaries, land use, water, buildings, industrial/service/protected areas.

The source XAPK analysis found **no embedded Vietnam Point/Line/Polygon dataset**. The templates intentionally contain no copied AMap map geometry. Production data should come from licensed/open datasets, runtime-authorized sources or user-owned offline/cache packages.

Recommended long-lived flow:

```text
Licensed/Open source data
        ↓
Normalize to EPSG:4326
        ↓
vn_points / vn_lines / vn_polygons
        ↓
GeoPackage / PostGIS / VFM master
        ↓
PMTiles / MVT distribution
        ↓
MapLibre / AMap runtime adapters
```

See `data/vietnam-gis-extraction-kit/README.md`.

