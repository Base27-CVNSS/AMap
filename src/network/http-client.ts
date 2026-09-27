import { LruCache } from "../cache/lru.js";
import type { EndpointRegistry } from "./endpoint-registry.js";

export interface HttpClientOptions {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  cacheCapacity?: number;
  defaultHeaders?: Record<string, string>;
}

export interface HttpRequestOptions {
  operation?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  cache?: boolean;
}

export class HttpClient {
  private readonly cache: LruCache<string, unknown>;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;

  constructor(
    private readonly endpoints: EndpointRegistry,
    private readonly options: HttpClientOptions = {}
  ) {
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.maxRetries = options.maxRetries ?? 2;
    this.retryDelayMs = options.retryDelayMs ?? 400;
    this.cache = new LruCache(options.cacheCapacity ?? 100);
  }

  async request<T>(endpointId: string, options: HttpRequestOptions = {}): Promise<T> {
    const resolved = this.endpoints.resolve(endpointId, options.operation);
    const url = new URL(resolved.url);

    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }

    const method = options.method ?? "GET";
    const cacheKey = method + ":" + url.toString();
    if (method === "GET" && options.cache !== false) {
      const hit = this.cache.get(cacheKey);
      if (hit !== undefined) return hit as T;
    }

    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (options.signal?.aborted) throw new Error("Request aborted");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      const abort = () => controller.abort();
      options.signal?.addEventListener("abort", abort, { once: true });

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            ...this.options.defaultHeaders,
            ...options.headers
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });

        if (!response.ok) {
          const error = new Error(`HTTP ${response.status} ${response.statusText}`);
          if (response.status < 500 && response.status !== 429) throw error;
          lastError = error;
        } else {
          const data = await response.json() as T;
          if (method === "GET" && options.cache !== false) this.cache.set(cacheKey, data);
          return data;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (options.signal?.aborted) throw new Error("Request aborted");
      } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener("abort", abort);
      }

      if (attempt < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelayMs * 2 ** attempt));
      }
    }

    throw lastError ?? new Error("Request failed");
  }

  clearCache(): void {
    this.cache.clear();
  }
}
