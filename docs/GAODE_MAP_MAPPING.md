# gaode-map -> AMap platform mapping

The reference repository `Base27-CVNSS/gaode-map` is primarily a React Native / Expo mapping SDK with core, navigation, search and web-api packages.

AMap does not copy those implementations. It maps the **capability families** into provider-neutral platform boundaries.

| gaode-map capability family | AMap 0.2.0 boundary |
|---|---|
| MapView | Map engine |
| Marker / Polyline / Polygon / Circle / HeatMap / Cluster | Overlay engine + canonical overlay model |
| GeoUtils / RouteUtils | Geometry engine |
| OfflineMapManager | Offline engine + OfflineProvider |
| PermissionUtils / privacy initialization | Policy engine |
| PlatformDetector / runtime gate | Runtime engine |
| built-in search | Search engine |
| Web API geocode | SearchProvider.geocode |
| reverse geocode | SearchProvider.reverseGeocode |
| POI / nearby | SearchProvider.searchPoi/searchNearby |
| input tips | SearchProvider.inputTips |
| route planning | RoutingProvider |
| web route fallback | Provider adapter fallback chain |
| NaviView | Navigation engine |
| web route following | RoutePlayback / navigation progress |
| error handling | Network + Observability |
| retry/cache | HttpClient + LruCache |
| example catalog | examples + capability matrix |

## Why this is more durable

A React Native native module can be one adapter. A browser/WebGIS implementation can be another. A local Rust/WASM or robot runtime can be another.

The domain contracts do not change when the transport or platform changes.
