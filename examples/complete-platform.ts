import {
  HttpClient,
  LruCache,
  RoutePlayback,
  createDefaultPlatform,
  haversineDistanceMeters
} from "../src/index.js";

const platform = createDefaultPlatform();

platform.endpoints
  .register({
    id: "search",
    provider: "example-search",
    protocol: "https",
    host: "search.example.invalid",
    port: 443,
    basePath: "/v1",
    operations: {
      geocode: "/geocode",
      poi: "/poi"
    }
  })
  .register({
    id: "traffic",
    provider: "example-traffic",
    protocol: "https",
    host: "traffic.example.invalid",
    port: 443,
    basePath: "/v1"
  });

await platform.engines.startAll(platform.context);
platform.runtime.require(["map.render", "search.poi", "routing.route"]);

const client = new HttpClient(platform.endpoints);
const cache = new LruCache<string, number>(2);
cache.set("a", 1);

const hcm = { longitude: 106.7009, latitude: 10.7769 };
const bienHoa = { longitude: 106.8243, latitude: 10.9574 };

console.log("Straight-line distance:", haversineDistanceMeters(hcm, bienHoa));
console.log("Search endpoint:", platform.endpoints.resolve("search", "poi"));
console.log("Diagnostics:", platform.diagnostics());
console.log("HTTP client ready:", Boolean(client));

const playback = new RoutePlayback([hcm, bienHoa], 15);
console.log("Playback:", playback.step(5));

await platform.engines.stopAll(platform.context);
