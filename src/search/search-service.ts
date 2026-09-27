import type {
  GeocodeRequest,
  GeocodeResult,
  InputTip,
  NearbySearchRequest,
  Poi,
  PoiSearchRequest,
  ReverseGeocodeRequest,
  ReverseGeocodeResult,
  SearchProvider
} from "./contracts.js";

export class SearchService {
  constructor(private provider: SearchProvider) {}

  use(provider: SearchProvider): void {
    this.provider = provider;
  }

  get providerId(): string {
    return this.provider.id;
  }

  geocode(request: GeocodeRequest): Promise<GeocodeResult[]> {
    return this.provider.geocode(request);
  }

  reverseGeocode(request: ReverseGeocodeRequest): Promise<ReverseGeocodeResult> {
    return this.provider.reverseGeocode(request);
  }

  poi(request: PoiSearchRequest): Promise<Poi[]> {
    return this.provider.searchPoi(request);
  }

  nearby(request: NearbySearchRequest): Promise<Poi[]> {
    return this.provider.searchNearby(request);
  }

  inputTips(keywords: string, city?: string): Promise<InputTip[]> {
    return this.provider.inputTips(keywords, city);
  }
}
