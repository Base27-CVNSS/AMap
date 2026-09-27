import type { Capability } from "../core/types.js";
import type { EngineRegistry } from "../core/engine-registry.js";

export type RuntimePlatform = "web" | "android" | "ios" | "desktop" | "server" | "unknown";

export interface RuntimeInfo {
  platform: RuntimePlatform;
  userAgent?: string;
  touch: boolean;
}

export function detectRuntime(): RuntimeInfo {
  const nav = typeof navigator === "undefined" ? undefined : navigator;
  const userAgent = nav?.userAgent;
  const ua = userAgent?.toLowerCase() ?? "";

  let platform: RuntimePlatform = "unknown";
  if (typeof window !== "undefined") platform = "web";
  if (/android/.test(ua)) platform = "android";
  if (/iphone|ipad|ipod/.test(ua)) platform = "ios";
  if (typeof process !== "undefined" && process.versions?.node && typeof window === "undefined") platform = "server";

  return {
    platform,
    userAgent,
    touch: typeof nav !== "undefined" && nav.maxTouchPoints > 0
  };
}

export class RuntimeGate {
  constructor(private readonly engines: EngineRegistry) {}

  supports(capability: Capability): boolean {
    return this.engines.byCapability(capability).length > 0;
  }

  require(capabilities: readonly Capability[]): void {
    const missing = capabilities.filter(capability => !this.supports(capability));
    if (missing.length) throw new Error(`Missing capabilities: ${missing.join(", ")}`);
  }
}
