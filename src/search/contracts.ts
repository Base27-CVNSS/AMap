import type { Coordinate } from "../geometry/geo.js";

export interface Poi {
  id: string;
  name: string;
  coordinate: Coordinate;
  address?: string;
  category?: string;
  phone?: string;
  distanceMeters?: number;
  metadata?: Record<string, unknown>;
}

export interface GeocodeRequest {
  address: string;
  city?: string;
}

export interface GeocodeResult {
  formattedAddress: string;
  coordinate: Coordinate;
  confidence?: number;
  providerId?: string;
}

export interface ReverseGeocodeRequest {
  coordinate: Coordinate;
  radiusMeters?: number;
}

export interface ReverseGeocodeResult {
  formattedAddress: string;
  addressComponents?: Record<string, string>;
  pois?: Poi[];
  providerId?: string;
}

export interface PoiSearchRequest {
  keywords: string;
  city?: string;
  page?: number;
  pageSize?: number;
  category?: string;
}

export interface NearbySearchRequest {
  coordinate: Coordinate;
  radiusMeters?: number;
  keywords?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface InputTip {
  id?: string;
  name: string;
  coordinate?: Coordinate;
  address?: string;
  category?: string;
}

export interface SearchProvider {
  readonly id: string;
  geocode(request: GeocodeRequest): Promise<GeocodeResult[]>;
  reverseGeocode(request: ReverseGeocodeRequest): Promise<ReverseGeocodeResult>;
  searchPoi(request: PoiSearchRequest): Promise<Poi[]>;
  searchNearby(request: NearbySearchRequest): Promise<Poi[]>;
  inputTips(keywords: string, city?: string): Promise<InputTip[]>;
}
