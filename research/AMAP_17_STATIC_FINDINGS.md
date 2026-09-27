# AMap 17.00.0.2009 — static architecture findings

Source analyzed locally: `AMap+Global_17.00.0.2009_APKPure.xapk`.

This document records architectural observations only. Proprietary binaries and bundled application code are intentionally not committed.

## Package structure

Observed split package:

- base package: `com.autonavi.minimap.apk`
- ARM64 split: `config.arm64_v8a.apk`
- language split: `config.en.apk`
- density split: `config.mdpi.apk`

Base APK contains eight DEX files. ARM64 split contains 105 native libraries. The base APK contains 34 JavaScript files.

## High-value engine boundaries

Static string and asset evidence associates:

- `libamaptbt.so` — turn-by-turn navigation, guidance, traffic/TMC, lanes, traffic lights, cameras
- `libamaploc.so` — positioning, RTK/VDR, map matching, lane localization, fusion
- `libamapar.so` — AR navigation, VIO/SLAM, OpenCV/Ceres-style CV pipeline
- `libmap_kit.so` — map runtime/rendering facade
- `libnavi_kit.so` — navigation service facade
- `liblocation_kit.so` — location facade
- `libajx.so` — packaged UI/runtime bridge
- `libXcdnEngine.so`, `libtnet.so`, `libxquic.so` — network/CDN/transport components

The largest base asset observed was `assets/ajx.bundle/bundles.oajx` (~76 MB), indicating a substantial packaged UI/business runtime above native engines.

## Observed capability evidence

Static strings/assets indicate concepts for:

- TMC and congestion segments
- ETA traffic updates and traffic reporting
- lane-level matching and lane suggestions
- traffic-light state/countdown/guidance
- speed-limit signs and enforcement cameras
- toll gates, checkpoints and road facilities
- GNSS, RTK, VDR, AHRS and sensor fusion
- SD/HD map matching
- HMM/Viterbi and Kalman-related logic
- OpenCV/ORB/RANSAC/PnP/Ceres/SLAM
- MNN inference, segmentation and depth

## Network observation

Many capabilities reference relative API paths rather than embedding one fixed host in feature logic. This supports the architectural decision to isolate:

```text
Endpoint Registry -> Gateway/Provider Adapter -> Domain Engine
```

The reusable implementation in `src/` therefore uses placeholder deployment endpoints and never imports vendor-private endpoint strings.
