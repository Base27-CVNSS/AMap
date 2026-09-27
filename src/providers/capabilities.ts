import type { Coordinate, BoundingBox } from "../geometry/geo.js";
import type { Overlay } from "../map/overlays.js";
import type { RoutingProvider } from "../routing/contracts.js";
import type { SearchProvider } from "../search/contracts.js";
import type { OfflineProvider } from "../offline/contracts.js";

export interface MapProvider {
  readonly id: string;
  setCamera(camera: { center: Coordinate; zoom?: number; bearing?: number; pitch?: number }): Promise<void>;
  fitBounds(bounds: BoundingBox, paddingPixels?: number): Promise<void>;
}

export interface OverlayCapabilityProvider {
  readonly id: string;
  setOverlays(overlays: readonly Overlay[]): Promise<void>;
}

export interface TrafficProvider {
  readonly id: string;
  getLinkState(linkIds: readonly string[]): Promise<Array<{
    roadLinkId: string;
    speedKph?: number;
    congestion?: "free" | "slow" | "heavy" | "blocked" | "unknown";
    timestamp: string;
  }>>;
}

export interface SignalProvider {
  readonly id: string;
  getRealtime(signalIds: readonly string[]): Promise<Array<{
    signalId: string;
    state: "red" | "yellow" | "green" | "flashing" | "unknown";
    countdownSeconds?: number;
    timestamp: string;
  }>>;
}

export interface LocationProvider {
  readonly id: string;
  current(): Promise<{ coordinate: Coordinate; accuracyMeters?: number; heading?: number; speedMps?: number; timestamp: string }>;
}

export type {
  SearchProvider,
  RoutingProvider,
  OfflineProvider
};
