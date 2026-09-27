import type { Coordinate } from "../geometry/geo.js";
import { haversineDistanceMeters, polylineLengthMeters } from "../geometry/geo.js";

export interface PlaybackState {
  coordinate: Coordinate;
  segmentIndex: number;
  progress: number;
  distanceMeters: number;
  totalDistanceMeters: number;
  finished: boolean;
}

function interpolate(a: Coordinate, b: Coordinate, t: number): Coordinate {
  return {
    longitude: a.longitude + (b.longitude - a.longitude) * t,
    latitude: a.latitude + (b.latitude - a.latitude) * t
  };
}

export class RoutePlayback {
  private distance = 0;
  private readonly total: number;

  constructor(
    private readonly geometry: readonly Coordinate[],
    private readonly speedMetersPerSecond = 12
  ) {
    if (geometry.length < 2) throw new Error("Playback requires at least two route points");
    if (speedMetersPerSecond <= 0) throw new Error("Playback speed must be positive");
    this.total = polylineLengthMeters(geometry);
  }

  reset(): void {
    this.distance = 0;
  }

  step(deltaSeconds: number): PlaybackState {
    this.distance = Math.min(this.total, this.distance + Math.max(0, deltaSeconds) * this.speedMetersPerSecond);
    return this.stateAtDistance(this.distance);
  }

  seek(progress: number): PlaybackState {
    this.distance = this.total * Math.max(0, Math.min(1, progress));
    return this.stateAtDistance(this.distance);
  }

  private stateAtDistance(target: number): PlaybackState {
    let traversed = 0;

    for (let i = 1; i < this.geometry.length; i++) {
      const a = this.geometry[i - 1]!;
      const b = this.geometry[i]!;
      const segment = haversineDistanceMeters(a, b);

      if (target <= traversed + segment || i === this.geometry.length - 1) {
        const local = segment === 0 ? 1 : Math.max(0, Math.min(1, (target - traversed) / segment));
        return {
          coordinate: interpolate(a, b, local),
          segmentIndex: i - 1,
          progress: this.total === 0 ? 1 : target / this.total,
          distanceMeters: target,
          totalDistanceMeters: this.total,
          finished: target >= this.total
        };
      }
      traversed += segment;
    }

    const coordinate = this.geometry[this.geometry.length - 1]!;
    return { coordinate, segmentIndex: this.geometry.length - 2, progress: 1, distanceMeters: this.total, totalDistanceMeters: this.total, finished: true };
  }
}
