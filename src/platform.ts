import { BaseEngine } from "./core/base-engine.js";
import { EngineRegistry } from "./core/engine-registry.js";
import type { EngineContext } from "./core/types.js";
import { ENGINE_CATALOG } from "./engines/catalog.js";
import { EndpointRegistry } from "./network/endpoint-registry.js";
import { ProviderRegistry } from "./providers/provider.js";
import { RuntimeGate } from "./runtime/platform.js";
import { collectDiagnostics } from "./diagnostics/diagnostics.js";

export interface MultiEnginePlatform {
  engines: EngineRegistry;
  endpoints: EndpointRegistry;
  providers: ProviderRegistry;
  context: EngineContext;
  runtime: RuntimeGate;
  diagnostics(): ReturnType<typeof collectDiagnostics>;
}

export function createDefaultPlatform(): MultiEnginePlatform {
  const engines = new EngineRegistry();
  for (const descriptor of ENGINE_CATALOG) engines.register(new BaseEngine(descriptor));

  const endpoints = new EndpointRegistry();
  const providers = new ProviderRegistry();

  const context: EngineContext = {
    now: () => Date.now(),
    log: (scope, message, meta) => {
      const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
      console.log(`[${scope}] ${message}${suffix}`);
    }
  };

  return {
    engines,
    endpoints,
    providers,
    context,
    runtime: new RuntimeGate(engines),
    diagnostics: () => collectDiagnostics(engines, endpoints, providers)
  };
}
