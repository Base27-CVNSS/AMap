export type EngineKind =
  | "map"
  | "overlay"
  | "search"
  | "road"
  | "lane"
  | "traffic"
  | "signal"
  | "sign"
  | "routing"
  | "navigation"
  | "positioning"
  | "perception"
  | "offline"
  | "runtime"
  | "storage"
  | "algorithm"
  | "geometry"
  | "network"
  | "policy"
  | "observability";

export type Capability =
  | "storage.kv"
  | "storage.sql"
  | "network.request"
  | "algorithm.graph"
  | "algorithm.sequence"
  | "geometry.normalize"
  | "geometry.measure"
  | "road.graph"
  | "road.topology"
  | "lane.model"
  | "lane.match"
  | "map.render"
  | "map.tiles"
  | "map.camera"
  | "overlay.render"
  | "search.geocode"
  | "search.reverse-geocode"
  | "search.poi"
  | "search.nearby"
  | "search.input-tips"
  | "traffic.realtime"
  | "traffic.incident"
  | "signal.static"
  | "signal.realtime"
  | "sign.static"
  | "position.gnss"
  | "position.rtk"
  | "position.fusion"
  | "position.map-match"
  | "routing.route"
  | "routing.reroute"
  | "routing.multimodal"
  | "navigation.follow"
  | "navigation.guidance"
  | "navigation.playback"
  | "perception.cv"
  | "perception.slam"
  | "offline.catalog"
  | "offline.download"
  | "offline.update"
  | "policy.privacy"
  | "policy.permission"
  | "observability.health"
  | "observability.metrics"
  | "runtime.plugin"
  | "runtime.bridge"
  | "runtime.platform";

export interface EngineDescriptor {
  id: string;
  kind: EngineKind;
  version: string;
  capabilities: readonly Capability[];
  requires?: readonly string[];
  optional?: readonly string[];
  description?: string;
}

export interface EngineHealth {
  ok: boolean;
  state: "created" | "starting" | "running" | "stopping" | "stopped" | "error";
  message?: string;
}

export interface EngineContext {
  now(): number;
  log(scope: string, message: string, meta?: Record<string, unknown>): void;
}

export interface Engine {
  readonly descriptor: EngineDescriptor;
  start(context: EngineContext): Promise<void>;
  stop(context: EngineContext): Promise<void>;
  health(): EngineHealth;
}
