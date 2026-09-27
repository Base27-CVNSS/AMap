# Offline packaging

Recommended logical package layout:

```text
offline/
  manifest.json
  basemap.pmtiles
  roads.vfm
  lanes.vfm
  routing.graph
  signals.vfm
  signs.vfm
  traffic-cache/
  semantic/
  voice-pack/
  perception-models/
```

Map rendering packages and route-graph packages are intentionally separate because they have different update cadence and performance requirements.

Every package should have:

- stable package ID
- version
- byte size
- checksum
- region/extent
- dependency list
- provenance/license metadata
- optional delta-update metadata
