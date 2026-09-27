# Clean-room reuse policy

This repository separates **observed architecture** from **reusable implementation**.

## Allowed direction

Use static analysis to identify capability boundaries and interoperability needs, then implement new interfaces, schemas and algorithms independently.

## Do not commit

- proprietary APK/XAPK files
- copied DEX/JAR/native library code
- vendor ML model weights
- vendor map/style/data packages
- private keys, tokens, cookies or signatures
- bulk private/proprietary endpoint catalogs
- code intended to bypass authentication, billing or access controls

## Prefer

- documented standards
- open-source upstream libraries under compatible licenses
- OSM / PMTiles / MapLibre or licensed datasets
- provider-neutral contracts
- deployment-time endpoint configuration
- provenance metadata for every imported dataset
