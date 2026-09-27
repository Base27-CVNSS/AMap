# Multi-Engine Architecture

## 1. Architectural boundary

The platform is split into four layers:

```text
┌──────────────────────────────────────────────────────┐
│ Application / WebGIS / Navigation / ADAS / Robot UI │
├──────────────────────────────────────────────────────┤
│ Runtime + Plugin SDK + Capability API                │
├──────────────────────────────────────────────────────┤
│ Domain Engines                                       │
│ Map Road Lane Traffic Signal Sign Routing Position  │
│ Perception Offline Storage Algorithms               │
├──────────────────────────────────────────────────────┤
│ Provider Adapters + Endpoint Registry + Network      │
└──────────────────────────────────────────────────────┘
```

Domain engines must not import provider-specific URLs, credentials or wire formats.

## 2. Canonical domains

### Road
Stable road/link/node topology. Dynamic congestion does not mutate the base road graph.

### Lane
Lane geometry, lane connectivity, markings, allowed movements and lane matching.

### Traffic
Time-varying state keyed to stable road/link IDs: speed, congestion, incident, closure and confidence.

### Signal
Intersection -> approach -> lane -> movement -> signal group -> phase -> realtime state.

### Sign / facility
Speed limit, warning/regulatory sign, enforcement camera, checkpoint, toll gate and road facility.

### Routing
Route search and scoring are separate from navigation progress and guidance.

### Positioning
GNSS/RTK/IMU/VDR -> sensor fusion -> map matching -> optional lane matching.

### Perception
Camera/IMU -> CV/VIO/SLAM -> lane/light/sign observations -> fused world state.

## 3. Engine lifecycle

Every engine has:

- a stable descriptor
- declared capabilities
- required dependencies
- optional dependencies
- start / stop lifecycle
- health state

The registry performs topological startup and rejects dependency cycles.

## 4. Endpoint isolation

All network configuration belongs in `src/network` and deployment config.

```text
feature
  -> provider interface
    -> endpoint registry
      -> transport
```

This is important for long-lived systems because API hosts, ports, gateways, authentication and vendors change faster than domain models.

## 5. Offline packaging

Recommended logical packages:

```text
offline/
  manifest.json
  basemap.pmtiles
  roads.vfm
  routing.graph
  lanes.vfm
  signals.vfm
  signs.vfm
  traffic-cache/
  voice-pack/
```

Map rendering data and routing graph data may evolve independently.

## 6. VFM integration direction

A future VFM adapter can provide canonical spatial/world data for:

- road geometry/topology
- lane geometry/connectivity
- traffic signals
- signs/facilities
- object state
- timestamps/history
- relationships

The engines operate on those contracts rather than depending on one storage format.
