# AMap Multi-Engine Platform

A clean-room architecture study and reusable multi-engine geospatial/navigation platform inspired by the capability boundaries observed in modern navigation systems.

> **Scope:** architecture, interfaces, schemas, adapters, and reusable algorithms.  
> **Not included:** proprietary AMap/Gaode binaries, bundled map data, private keys, copied application code, proprietary ML models, or hard-wired private endpoints.

## Platform model

```text
Application / UI
      │
Runtime + Plugin SDK
      │
Capability API / Contracts
      │
┌─────┼────────┬────────┬─────────┬──────────┐
Map   Road     Lane     Traffic   Navigation Positioning
│     │        │        │         │          │
└─────┴────────┴────┬───┴─────────┴──────────┘
                    │
             Algorithms / State
                    │
          Provider Adapter Layer
                    │
        Endpoint Registry / Network
```

## Engines

The platform treats each major capability as a replaceable engine:

| Engine | Responsibility |
|---|---|
| Map | renderer, vector tiles, style, labels, camera |
| Road | road graph, topology, restrictions, speed/toll attributes |
| Lane | lane geometry, connectivity, markings, lane guidance |
| Traffic | TMC-like dynamic state, congestion, incidents, travel time |
| Signal | traffic-light topology, phase/state/countdown adapters |
| Sign | speed limits, signs, cameras, checkpoints, road facilities |
| Routing | route search, alternatives, reroute, maneuvers, ETA |
| Positioning | GNSS/RTK/IMU/VDR fusion, map matching, lane matching |
| Perception | CV, lane/sign/light perception, VIO/SLAM, depth |
| Offline | package index, map/route/voice packs, delta updates, cache |
| Runtime | JS/native bridge, plugin lifecycle, feature flags |
| Storage | SQLite/KV/binary cache abstractions |
| Algorithms | graph search, HMM/Viterbi, Kalman/fusion, ETA, CV/SLAM |

## Core rule

**Core code never depends directly on a vendor hostname or private endpoint.**

Every external system is reached through:

```text
Engine -> Capability Contract -> Provider Adapter -> Endpoint Registry -> Network
```

This makes the platform replaceable across OSM/PMTiles/MapLibre/custom traffic feeds or other licensed providers.

## Repository layout

```text
src/
  core/              engine lifecycle + contracts
  engines/           engine catalog
  network/           endpoint registry
  providers/         provider interfaces
  platform.ts        composition root
schemas/             canonical road/lane/signal/sign schemas
config/              deployment-time endpoint examples
docs/                architecture and clean-room rules
examples/            bootstrap examples
index.html           architecture overview
```

## Development

```bash
npm install
npm run check
npm run build
```

## Design goal

The repository is a long-lived foundation for WebGIS, navigation, ADAS, robotics and spatial world-model applications. Data contracts stay stable while renderers, routing engines, traffic sources, positioning systems and perception stacks remain replaceable.
