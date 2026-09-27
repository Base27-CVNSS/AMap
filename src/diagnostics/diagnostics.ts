import type { EngineRegistry } from "../core/engine-registry.js";
import type { EndpointRegistry } from "../network/endpoint-registry.js";
import type { ProviderRegistry } from "../providers/provider.js";
import { detectRuntime } from "../runtime/platform.js";

export interface DiagnosticReport {
  timestamp: string;
  runtime: ReturnType<typeof detectRuntime>;
  engineCount: number;
  endpointCount: number;
  providerCount: number;
  engines: ReturnType<EngineRegistry["health"]>;
  healthy: boolean;
}

export function collectDiagnostics(
  engines: EngineRegistry,
  endpoints: EndpointRegistry,
  providers: ProviderRegistry
): DiagnosticReport {
  const health = engines.health();
  return {
    timestamp: new Date().toISOString(),
    runtime: detectRuntime(),
    engineCount: engines.list().length,
    endpointCount: endpoints.list().length,
    providerCount: providers.list().length,
    engines: health,
    healthy: Object.values(health).every(item => item.ok)
  };
}
