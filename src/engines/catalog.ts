import type { EngineDescriptor } from "../core/types.js";

export const ENGINE_CATALOG: readonly EngineDescriptor[] = [
  { id: "storage", kind: "storage", version: "0.2.0", capabilities: ["storage.kv", "storage.sql"], description: "SQL/KV/binary/cache abstraction" },
  { id: "network", kind: "network", version: "0.2.0", capabilities: ["network.request"], description: "Endpoint resolution, timeout, retry and transport" },
  { id: "algorithms", kind: "algorithm", version: "0.2.0", capabilities: ["algorithm.graph", "algorithm.sequence"], description: "Graph, HMM/Viterbi, filtering and ML primitives" },
  { id: "geometry", kind: "geometry", version: "0.2.0", capabilities: ["geometry.normalize", "geometry.measure"], description: "Coordinate normalization, distance, bounds and geometry utilities" },
  { id: "road", kind: "road", version: "0.2.0", capabilities: ["road.graph", "road.topology"], requires: ["storage", "geometry"], description: "Road links, nodes, topology, restrictions and static attributes" },
  { id: "lane", kind: "lane", version: "0.2.0", capabilities: ["lane.model", "lane.match"], requires: ["road", "algorithms", "geometry"], description: "Lane geometry/connectivity and lane-level matching" },
  { id: "map", kind: "map", version: "0.2.0", capabilities: ["map.render", "map.tiles", "map.camera"], requires: ["storage", "geometry"], optional: ["road", "lane"], description: "Renderer, vector tiles, style, labels and camera" },
  { id: "overlay", kind: "overlay", version: "0.2.0", capabilities: ["overlay.render"], requires: ["map", "geometry"], description: "Marker, line, polygon, circle, heatmap and cluster model" },
  { id: "search", kind: "search", version: "0.2.0", capabilities: ["search.geocode", "search.reverse-geocode", "search.poi", "search.nearby", "search.input-tips"], requires: ["network", "geometry"], optional: ["storage"], description: "Geocoding, POI discovery and suggestions" },
  { id: "traffic", kind: "traffic", version: "0.2.0", capabilities: ["traffic.realtime", "traffic.incident"], requires: ["road", "network"], description: "Dynamic link state, congestion, incidents and travel time" },
  { id: "signal", kind: "signal", version: "0.2.0", capabilities: ["signal.static", "signal.realtime"], requires: ["road", "lane", "network"], description: "Traffic-light topology, movement, phase and realtime state" },
  { id: "sign", kind: "sign", version: "0.2.0", capabilities: ["sign.static"], requires: ["road"], optional: ["lane"], description: "Road signs, limits, cameras, checkpoints and facilities" },
  { id: "positioning", kind: "positioning", version: "0.2.0", capabilities: ["position.gnss", "position.rtk", "position.fusion", "position.map-match"], requires: ["road", "algorithms", "geometry"], optional: ["lane"], description: "GNSS/RTK/IMU/VDR fusion and map/lane matching" },
  { id: "routing", kind: "routing", version: "0.2.0", capabilities: ["routing.route", "routing.reroute", "routing.multimodal"], requires: ["road", "algorithms", "geometry"], optional: ["lane", "traffic", "signal", "sign"], description: "Route search, alternatives, cost model and multimodal routing" },
  { id: "navigation", kind: "navigation", version: "0.2.0", capabilities: ["navigation.follow", "navigation.guidance", "navigation.playback"], requires: ["routing", "positioning"], optional: ["traffic", "signal", "sign", "lane"], description: "Route progress, reroute, maneuver guidance and playback" },
  { id: "perception", kind: "perception", version: "0.2.0", capabilities: ["perception.cv", "perception.slam"], requires: ["algorithms", "geometry"], optional: ["positioning", "lane", "signal", "sign"], description: "CV, VIO/SLAM, depth and road-object perception" },
  { id: "offline", kind: "offline", version: "0.2.0", capabilities: ["offline.catalog", "offline.download", "offline.update"], requires: ["storage", "network"], optional: ["map", "road", "lane", "routing"], description: "Offline package catalog, lifecycle, cache and delta update" },
  { id: "policy", kind: "policy", version: "0.2.0", capabilities: ["policy.privacy", "policy.permission"], description: "Consent, privacy and permission abstractions" },
  { id: "observability", kind: "observability", version: "0.2.0", capabilities: ["observability.health", "observability.metrics"], description: "Health, diagnostics, logs and metrics" },
  { id: "runtime", kind: "runtime", version: "0.2.0", capabilities: ["runtime.plugin", "runtime.bridge", "runtime.platform"], requires: ["map", "policy", "observability"], optional: ["overlay", "search", "navigation", "offline", "perception"], description: "Plugin lifecycle and native/web/runtime bridge boundary" }
] as const;
