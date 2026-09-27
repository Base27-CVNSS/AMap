import type { EngineDescriptor } from "../core/types.js";

export const ENGINE_CATALOG: readonly EngineDescriptor[] = [
  {
    id: "storage",
    kind: "storage",
    version: "0.1.0",
    capabilities: ["storage.kv", "storage.sql"],
    description: "SQLite/KV/cache abstraction"
  },
  {
    id: "network",
    kind: "network",
    version: "0.1.0",
    capabilities: ["network.request"],
    description: "Provider-neutral transport and endpoint resolution"
  },
  {
    id: "algorithms",
    kind: "algorithm",
    version: "0.1.0",
    capabilities: ["algorithm.graph", "algorithm.sequence"],
    description: "Graph, HMM/Viterbi, filtering and reusable algorithm primitives"
  },
  {
    id: "road",
    kind: "road",
    version: "0.1.0",
    capabilities: ["road.graph", "road.topology"],
    requires: ["storage"],
    description: "Road links, nodes, topology, restrictions and static attributes"
  },
  {
    id: "lane",
    kind: "lane",
    version: "0.1.0",
    capabilities: ["lane.model", "lane.match"],
    requires: ["road", "algorithms"],
    description: "Lane geometry/connectivity and lane-level matching"
  },
  {
    id: "map",
    kind: "map",
    version: "0.1.0",
    capabilities: ["map.render", "map.tiles"],
    requires: ["storage"],
    optional: ["road", "lane"],
    description: "Renderer, vector tiles, styles, labels and camera"
  },
  {
    id: "traffic",
    kind: "traffic",
    version: "0.1.0",
    capabilities: ["traffic.realtime", "traffic.incident"],
    requires: ["road", "network"],
    description: "Dynamic link state, congestion, incidents and travel time"
  },
  {
    id: "signal",
    kind: "signal",
    version: "0.1.0",
    capabilities: ["signal.static", "signal.realtime"],
    requires: ["road", "lane", "network"],
    description: "Traffic-light topology, movements, phases and realtime state"
  },
  {
    id: "sign",
    kind: "sign",
    version: "0.1.0",
    capabilities: ["sign.static"],
    requires: ["road"],
    optional: ["lane"],
    description: "Road signs, speed limits, cameras, checkpoints and facilities"
  },
  {
    id: "positioning",
    kind: "positioning",
    version: "0.1.0",
    capabilities: [
      "position.gnss",
      "position.rtk",
      "position.fusion",
      "position.map-match"
    ],
    requires: ["road", "algorithms"],
    optional: ["lane"],
    description: "GNSS/RTK/IMU/VDR fusion and map/lane matching"
  },
  {
    id: "routing",
    kind: "routing",
    version: "0.1.0",
    capabilities: ["routing.route", "routing.reroute", "routing.guidance"],
    requires: ["road", "algorithms"],
    optional: ["lane", "traffic", "signal", "sign"],
    description: "Route search, cost model, ETA, reroute and guidance"
  },
  {
    id: "perception",
    kind: "perception",
    version: "0.1.0",
    capabilities: ["perception.cv", "perception.slam"],
    requires: ["algorithms"],
    optional: ["positioning", "lane", "signal", "sign"],
    description: "CV, VIO/SLAM, depth and road-object perception"
  },
  {
    id: "offline",
    kind: "offline",
    version: "0.1.0",
    capabilities: ["offline.package"],
    requires: ["storage"],
    optional: ["map", "road", "lane", "routing"],
    description: "Map/route/voice packages, cache and delta updates"
  },
  {
    id: "runtime",
    kind: "runtime",
    version: "0.1.0",
    capabilities: ["runtime.plugin"],
    requires: ["map"],
    optional: ["routing", "traffic", "signal", "positioning", "perception"],
    description: "Plugin lifecycle and JS/native bridge boundary"
  }
] as const;
