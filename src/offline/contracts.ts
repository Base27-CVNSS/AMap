export type OfflinePackageKind =
  | "basemap"
  | "road"
  | "lane"
  | "routing"
  | "signal"
  | "sign"
  | "voice"
  | "semantic"
  | "perception-model";

export type OfflinePackageStatus =
  | "available"
  | "queued"
  | "downloading"
  | "paused"
  | "installed"
  | "update-available"
  | "error";

export interface OfflinePackage {
  id: string;
  name: string;
  kind: OfflinePackageKind;
  version: string;
  sizeBytes?: number;
  checksum?: string;
  region?: string;
  status?: OfflinePackageStatus;
  metadata?: Record<string, unknown>;
}

export interface DownloadProgress {
  packageId: string;
  receivedBytes: number;
  totalBytes?: number;
  percent?: number;
}

export interface OfflineProvider {
  readonly id: string;
  list(): Promise<OfflinePackage[]>;
  installed(): Promise<OfflinePackage[]>;
  download(packageId: string, onProgress?: (progress: DownloadProgress) => void): Promise<void>;
  pause(packageId: string): Promise<void>;
  resume(packageId: string): Promise<void>;
  remove(packageId: string): Promise<void>;
  checkUpdate(packageId: string): Promise<OfflinePackage | null>;
}
