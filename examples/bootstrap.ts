import { createDefaultPlatform } from "../src/platform.js";

const platform = createDefaultPlatform();

platform.endpoints.register({
  id: "traffic-primary",
  provider: "example-traffic-provider",
  protocol: "https",
  host: "traffic.example.invalid",
  port: 443,
  basePath: "/v1",
  operations: {
    state: "/traffic/state",
    incidents: "/traffic/incidents"
  },
  tags: ["traffic", "example"]
});

await platform.engines.startAll(platform.context);

console.log("Endpoint:", platform.endpoints.resolve("traffic-primary", "state"));
console.log("Health:", platform.engines.health());

await platform.engines.stopAll(platform.context);
