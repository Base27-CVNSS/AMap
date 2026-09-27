import type { Coordinate } from "../geometry/geo.js";

export type RouteMode = "driving" | "walking" | "cycling" | "electric-bike" | "transit";

export interface RouteRequest {
  origin: Coordinate;
  destination: Coordinate;
  mode: RouteMode;
  waypoints?: Coordinate[];
  alternatives?: number;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  avoidFerries?: boolean;
  departureTime?: string;
  metadata?: Record<string, unknown>;
}

export interface Maneuver {
  instruction: string;
  coordinate?: Coordinate;
  distanceMeters?: number;
  durationSeconds?: number;
  roadName?: string;
}

export interface RoutePath {
  id: string;
  mode: RouteMode;
  geometry: Coordinate[];
  distanceMeters: number;
  durationSeconds: number;
  maneuvers?: Maneuver[];
  tollCost?: number;
  metadata?: Record<string, unknown>;
}

export interface RouteResult {
  paths: RoutePath[];
  providerId?: string;
}

export interface RoutingProvider {
  readonly id: string;
  route(request: RouteRequest): Promise<RouteResult>;
}
