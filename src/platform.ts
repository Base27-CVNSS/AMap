import { BaseEngine } from "./core/base-engine.js";
import { EngineRegistry } from "./core/engine-registry.js";
import type { EngineContext } from "./core/types.js";
import { ENGINE_CATALOG } from "./engines/catalog.js";
import { EndpointRegistry } from "./network/endpoint-registry.js";
import { ProviderRegistry } from "./providers/provider.js";

export interface MultiEnginePlatform {
  engines: EngineRegistry;
  endpoints: EndpointRegistry;
  providers: ProviderRegistry;
  context: EngineContext;
}

export function createDefaultPlatform(): MultiEnginePlatform {
  const engines = new EngineRegistry();
  for (const descriptor of ENGINE_CATALOG) {
    engines.register(new BaseEngine(descriptor));
  }

  const context: EngineContext = {
    now: () => Date.now(),
    log: (scope, message, meta) => {
      const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
      console.log(`[${scope}] ${message}${suffix}`);
    }
  };

  return {
    engines,
    endpoints: new EndpointRegistry(),
    providers: new ProviderRegistry(),
    context
  };
}
