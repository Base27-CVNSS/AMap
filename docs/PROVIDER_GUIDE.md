# Provider guide

Provider adapters are the only modules that should know external API details.

## Rules

1. Domain engines consume canonical contracts.
2. Hostnames, API versions and ports stay in deployment configuration.
3. Credentials come from environment/platform secure storage.
4. Network adapters normalize provider-specific responses before returning them.
5. Private or undocumented endpoints are not a platform dependency.
6. A provider must be replaceable without changing domain schemas.

## Primary provider contracts

- `MapProvider`
- `OverlayCapabilityProvider`
- `SearchProvider`
- `RoutingProvider`
- `TrafficProvider`
- `SignalProvider`
- `LocationProvider`
- `OfflineProvider`

## Recommended adapter naming

```text
src/adapters/
  maplibre/
  pmtiles/
  osm/
  search-provider-a/
  routing-provider-a/
  traffic-provider-a/
  native-location/
  browser-geolocation/
```

Adapters should be separately licensed and tested.
