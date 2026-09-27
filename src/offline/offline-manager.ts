import type { DownloadProgress, OfflinePackage, OfflineProvider } from "./contracts.js";

export type OfflineEvent =
  | { type: "progress"; progress: DownloadProgress }
  | { type: "installed"; packageId: string }
  | { type: "removed"; packageId: string }
  | { type: "error"; packageId: string; error: Error };

export class OfflineManager {
  private readonly listeners = new Set<(event: OfflineEvent) => void>();

  constructor(private provider: OfflineProvider) {}

  use(provider: OfflineProvider): void {
    this.provider = provider;
  }

  list(): Promise<OfflinePackage[]> {
    return this.provider.list();
  }

  installed(): Promise<OfflinePackage[]> {
    return this.provider.installed();
  }

  async download(packageId: string): Promise<void> {
    try {
      await this.provider.download(packageId, progress => this.emit({ type: "progress", progress }));
      this.emit({ type: "installed", packageId });
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: "error", packageId, error: normalized });
      throw normalized;
    }
  }

  pause(packageId: string): Promise<void> {
    return this.provider.pause(packageId);
  }

  resume(packageId: string): Promise<void> {
    return this.provider.resume(packageId);
  }

  async remove(packageId: string): Promise<void> {
    await this.provider.remove(packageId);
    this.emit({ type: "removed", packageId });
  }

  checkUpdate(packageId: string): Promise<OfflinePackage | null> {
    return this.provider.checkUpdate(packageId);
  }

  subscribe(listener: (event: OfflineEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: OfflineEvent): void {
    for (const listener of this.listeners) listener(event);
  }
}
