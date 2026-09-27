import type {
  Capability,
  Engine,
  EngineContext,
  EngineDescriptor,
  EngineHealth
} from "./types.js";

export class EngineRegistry {
  private readonly engines = new Map<string, Engine>();
  private startOrder: string[] = [];

  register(engine: Engine): this {
    const id = engine.descriptor.id;
    if (this.engines.has(id)) {
      throw new Error(`Engine already registered: ${id}`);
    }
    this.engines.set(id, engine);
    return this;
  }

  get<T extends Engine = Engine>(id: string): T {
    const engine = this.engines.get(id);
    if (!engine) throw new Error(`Unknown engine: ${id}`);
    return engine as T;
  }

  list(): EngineDescriptor[] {
    return [...this.engines.values()].map((e) => e.descriptor);
  }

  byCapability(capability: Capability): Engine[] {
    return [...this.engines.values()].filter((engine) =>
      engine.descriptor.capabilities.includes(capability)
    );
  }

  private resolveOrder(): string[] {
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      if (visiting.has(id)) throw new Error(`Engine dependency cycle at: ${id}`);

      const engine = this.engines.get(id);
      if (!engine) throw new Error(`Missing required engine: ${id}`);

      visiting.add(id);
      for (const dependency of engine.descriptor.requires ?? []) {
        visit(dependency);
      }
      visiting.delete(id);
      visited.add(id);
      order.push(id);
    };

    for (const id of this.engines.keys()) visit(id);
    return order;
  }

  async startAll(context: EngineContext): Promise<void> {
    this.startOrder = this.resolveOrder();
    for (const id of this.startOrder) {
      await this.get(id).start(context);
    }
  }

  async stopAll(context: EngineContext): Promise<void> {
    for (const id of [...this.startOrder].reverse()) {
      await this.get(id).stop(context);
    }
    this.startOrder = [];
  }

  health(): Record<string, EngineHealth> {
    return Object.fromEntries(
      [...this.engines.entries()].map(([id, engine]) => [id, engine.health()])
    );
  }
}
