import {
  LruCache,
  RoutePlayback,
  createDefaultPlatform,
  haversineDistanceMeters
} from "../src/index.js";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error("Smoke test failed: " + message);
}

const platform = createDefaultPlatform();
assert(platform.engines.list().length === 20, "expected 20 engines");
assert(platform.engines.byCapability("search.poi").length === 1, "search capability missing");
assert(platform.engines.byCapability("navigation.follow").length === 1, "navigation capability missing");

platform.endpoints.register({
  id: "example",
  provider: "test",
  protocol: "https",
  host: "example.invalid",
  basePath: "/v1",
  operations: { ping: "/ping" }
});

const resolved = platform.endpoints.resolve("example", "ping");
assert(resolved.url === "https://example.invalid/v1/ping", "endpoint resolution mismatch");

const cache = new LruCache<string, number>(2);
cache.set("a", 1);
cache.set("b", 2);
cache.get("a");
cache.set("c", 3);
assert(cache.has("a"), "LRU should retain recently used entry");
assert(!cache.has("b"), "LRU should evict oldest entry");

const distance = haversineDistanceMeters(
  { longitude: 106.7009, latitude: 10.7769 },
  { longitude: 106.8243, latitude: 10.9574 }
);
assert(distance > 10_000, "distance calculation too small");

const playback = new RoutePlayback([
  { longitude: 106.7009, latitude: 10.7769 },
  { longitude: 106.8243, latitude: 10.9574 }
], 10);
const state = playback.step(1);
assert(state.progress > 0 && state.progress < 1, "playback progress invalid");

await platform.engines.startAll(platform.context);
assert(platform.diagnostics().healthy, "platform should be healthy after startup");
await platform.engines.stopAll(platform.context);

console.log("AMap 0.2.0 smoke test PASS");
