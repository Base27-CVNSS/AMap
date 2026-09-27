import type { Coordinate } from "../geometry/geo.js";

export type Overlay =
  | MarkerOverlay
  | PolylineOverlay
  | PolygonOverlay
  | CircleOverlay
  | HeatmapOverlay
  | ClusterOverlay;

interface OverlayBase {
  id: string;
  visible?: boolean;
  zIndex?: number;
  metadata?: Record<string, unknown>;
}

export interface MarkerOverlay extends OverlayBase {
  kind: "marker";
  coordinate: Coordinate;
  label?: string;
}

export interface PolylineOverlay extends OverlayBase {
  kind: "polyline";
  coordinates: Coordinate[];
  width?: number;
}

export interface PolygonOverlay extends OverlayBase {
  kind: "polygon";
  rings: Coordinate[][];
}

export interface CircleOverlay extends OverlayBase {
  kind: "circle";
  center: Coordinate;
  radiusMeters: number;
}

export interface HeatmapOverlay extends OverlayBase {
  kind: "heatmap";
  points: Array<{ coordinate: Coordinate; weight: number }>;
}

export interface ClusterOverlay extends OverlayBase {
  kind: "cluster";
  points: MarkerOverlay[];
  radiusPixels?: number;
}

export interface OverlayProvider {
  set(overlays: readonly Overlay[]): Promise<void>;
  upsert(overlay: Overlay): Promise<void>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}
