export type EngineKind =
  | "map"
  | "road"
  | "lane"
  | "traffic"
  | "signal"
  | "sign"
  | "routing"
  | "positioning"
  | "perception"
  | "offline"
  | "runtime"
  | "storage"
  | "algorithm"
  | "network";

export type Capability =
  | "map.render"
  | "map.tiles"
  | "road.graph"
  | "road.topology"
  | "lane.model"
  | "lane.match"
  | "traffic.realtime"
  | "traffic.incident"
  | "signal.static"
  | "signal.realtime"
  | "sign.static"
  | "routing.route"
  | "routing.reroute"
  | "routing.guidance"
  | "position.gnss"
  | "position.rtk"
  | "position.fusion"
  | "position.map-match"
  | "perception.cv"
  | "perception.slam"
  | "offline.package"
  | "runtime.plugin"
  | "storage.kv"
  | "storage.sql"
  | "algorithm.graph"
  | "algorithm.sequence"
  | "network.request";

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
