export type PermissionKind =
  | "location-foreground"
  | "location-background"
  | "camera"
  | "microphone"
  | "bluetooth"
  | "motion";

export type PermissionState = "unknown" | "granted" | "denied" | "restricted";

export interface ConsentRecord {
  purpose: string;
  granted: boolean;
  timestamp: string;
  version: string;
}

export interface PrivacyStore {
  get(purpose: string): Promise<ConsentRecord | undefined>;
  set(record: ConsentRecord): Promise<void>;
}

export class MemoryPrivacyStore implements PrivacyStore {
  private readonly records = new Map<string, ConsentRecord>();

  async get(purpose: string): Promise<ConsentRecord | undefined> {
    return this.records.get(purpose);
  }

  async set(record: ConsentRecord): Promise<void> {
    this.records.set(record.purpose, record);
  }
}

export interface PermissionProvider {
  get(kind: PermissionKind): Promise<PermissionState>;
  request(kind: PermissionKind): Promise<PermissionState>;
}

export class PolicyGate {
  constructor(private readonly privacy: PrivacyStore) {}

  async requireConsent(purpose: string, version: string): Promise<void> {
    const record = await this.privacy.get(purpose);
    if (!record?.granted || record.version !== version) {
      throw new Error(`Consent required: ${purpose}@${version}`);
    }
  }

  async grant(purpose: string, version: string): Promise<void> {
    await this.privacy.set({
      purpose,
      granted: true,
      timestamp: new Date().toISOString(),
      version
    });
  }

  async revoke(purpose: string, version: string): Promise<void> {
    await this.privacy.set({
      purpose,
      granted: false,
      timestamp: new Date().toISOString(),
      version
    });
  }
}
