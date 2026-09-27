export type ProviderKind =
  | "map-data"
  | "road-data"
  | "traffic"
  | "signal"
  | "sign"
  | "routing"
  | "positioning"
  | "perception"
  | "offline";

export interface ProviderAdapter {
  readonly id: string;
  readonly kind: ProviderKind;
  readonly version: string;
  initialize(): Promise<void>;
  dispose(): Promise<void>;
}

export class ProviderRegistry {
  private readonly providers = new Map<string, ProviderAdapter>();

  register(provider: ProviderAdapter): this {
    if (this.providers.has(provider.id)) {
      throw new Error(`Provider already registered: ${provider.id}`);
    }
    this.providers.set(provider.id, provider);
    return this;
  }

  get<T extends ProviderAdapter = ProviderAdapter>(id: string): T {
    const provider = this.providers.get(id);
    if (!provider) throw new Error(`Unknown provider: ${id}`);
    return provider as T;
  }

  list(): ProviderAdapter[] {
    return [...this.providers.values()];
  }
}
