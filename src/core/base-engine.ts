import type {
  Engine,
  EngineContext,
  EngineDescriptor,
  EngineHealth
} from "./types.js";

export class BaseEngine implements Engine {
  private state: EngineHealth["state"] = "created";

  constructor(readonly descriptor: EngineDescriptor) {}

  async start(context: EngineContext): Promise<void> {
    if (this.state === "running") return;
    this.state = "starting";
    context.log(this.descriptor.id, "starting", {
      kind: this.descriptor.kind,
      capabilities: this.descriptor.capabilities
    });
    this.state = "running";
  }

  async stop(context: EngineContext): Promise<void> {
    if (this.state === "stopped" || this.state === "created") return;
    this.state = "stopping";
    context.log(this.descriptor.id, "stopping");
    this.state = "stopped";
  }

  health(): EngineHealth {
    return {
      ok: this.state !== "error",
      state: this.state
    };
  }
}
