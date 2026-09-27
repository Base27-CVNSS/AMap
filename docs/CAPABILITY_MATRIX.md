# Capability matrix

| Domain | Core contract | Provider replaceable | Offline-capable |
|---|---:|---:|---:|
| Map render | yes | yes | yes |
| Overlay | yes | yes | yes |
| Search/geocode | yes | yes | optional |
| Road graph | yes | yes | yes |
| Lane model | yes | yes | yes |
| Traffic | yes | yes | cached |
| Signal realtime | yes | yes | static/cached |
| Sign/facility | yes | yes | yes |
| Routing | yes | yes | yes |
| Navigation | yes | yes | yes |
| Positioning | yes | yes | yes |
| Perception | yes | yes | yes |
| Offline packages | yes | yes | n/a |
| Privacy/permissions | yes | platform-specific | n/a |
| Diagnostics | yes | exporter-specific | yes |

The platform can combine different providers at the same time. For example MapLibre + PMTiles for rendering, a local routing graph, a custom traffic feed and browser/native positioning.
