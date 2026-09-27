export interface Coordinate {
  longitude: number;
  latitude: number;
}

export type CoordinateLike = Coordinate | readonly [number, number];

export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export function normalizeCoordinate(input: CoordinateLike): Coordinate {
  const longitude = Number(Array.isArray(input) ? input[0] : input.longitude);
  const latitude = Number(Array.isArray(input) ? input[1] : input.latitude);

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    throw new Error("Coordinate must contain finite longitude/latitude values");
  }
  if (longitude < -180 || longitude > 180) throw new Error("Longitude out of range");
  if (latitude < -90 || latitude > 90) throw new Error("Latitude out of range");

  return { longitude, latitude };
}

export function haversineDistanceMeters(a: CoordinateLike, b: CoordinateLike): number {
  const p1 = normalizeCoordinate(a);
  const p2 = normalizeCoordinate(b);
  const r = 6_371_008.8;
  const rad = Math.PI / 180;
  const dLat = (p2.latitude - p1.latitude) * rad;
  const dLon = (p2.longitude - p1.longitude) * rad;
  const lat1 = p1.latitude * rad;
  const lat2 = p2.latitude * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function boundsOf(points: readonly CoordinateLike[]): BoundingBox {
  if (points.length === 0) throw new Error("At least one coordinate is required");
  const normalized = points.map(normalizeCoordinate);
  return {
    west: Math.min(...normalized.map(p => p.longitude)),
    south: Math.min(...normalized.map(p => p.latitude)),
    east: Math.max(...normalized.map(p => p.longitude)),
    north: Math.max(...normalized.map(p => p.latitude))
  };
}

export function polylineLengthMeters(points: readonly CoordinateLike[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineDistanceMeters(points[i - 1]!, points[i]!);
  }
  return total;
}
