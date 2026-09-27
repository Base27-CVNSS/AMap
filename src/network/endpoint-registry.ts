export type NetworkProtocol = "http" | "https" | "ws" | "wss" | "tcp" | "udp";

export interface EndpointDefinition {
  id: string;
  provider: string;
  protocol: NetworkProtocol;
  host: string;
  port?: number;
  basePath?: string;
  operations?: Record<string, string>;
  tags?: readonly string[];
}

export interface ResolvedEndpoint {
  endpointId: string;
  operation?: string;
  url: string;
  port: number;
}

export class EndpointRegistry {
  private readonly endpoints = new Map<string, EndpointDefinition>();

  register(definition: EndpointDefinition): this {
    if (!definition.id || !definition.host) {
      throw new Error("Endpoint id and host are required");
    }
    if (definition.host.includes("/") || definition.host.includes("://")) {
      throw new Error("Endpoint host must not contain scheme or path");
    }
    const port = definition.port ?? this.defaultPort(definition.protocol);
    if (port < 1 || port > 65535) {
      throw new Error(`Invalid port for ${definition.id}: ${port}`);
    }
    if (this.endpoints.has(definition.id)) {
      throw new Error(`Endpoint already registered: ${definition.id}`);
    }
    this.endpoints.set(definition.id, { ...definition, port });
    return this;
  }

  get(id: string): EndpointDefinition {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) throw new Error(`Unknown endpoint: ${id}`);
    return endpoint;
  }

  resolve(id: string, operation?: string): ResolvedEndpoint {
    const endpoint = this.get(id);
    const port = endpoint.port ?? this.defaultPort(endpoint.protocol);
    const basePath = this.normalizePath(endpoint.basePath ?? "");
    const opPath = operation
      ? this.normalizePath(endpoint.operations?.[operation] ?? "")
      : "";
    const path = [basePath, opPath].filter(Boolean).join("");
    const defaultPort = this.defaultPort(endpoint.protocol);
    const portPart = port === defaultPort ? "" : `:${port}`;

    return {
      endpointId: id,
      operation,
      port,
      url: `${endpoint.protocol}://${endpoint.host}${portPart}${path || "/"}`
    };
  }

  list(): EndpointDefinition[] {
    return [...this.endpoints.values()].map((item) => ({ ...item }));
  }

  private defaultPort(protocol: NetworkProtocol): number {
    return protocol === "https" || protocol === "wss" ? 443 : 80;
  }

  private normalizePath(path: string): string {
    if (!path) return "";
    return path.startsWith("/") ? path : `/${path}`;
  }
}
