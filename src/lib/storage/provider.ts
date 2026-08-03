/**
 * StorageProvider abstraction — swap Firebase Storage <-> Cloudflare R2
 * without changing UI code.
 */

export interface UploadParams {
  uid: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  folder?: "documents" | "images" | "audio";
}

export interface UploadResult {
  storageKey: string;
  provider: "r2" | "firebase";
  uploadUrl: string;
  publicUrl?: string;
  expiresAt?: string;
}

export interface StorageProvider {
  readonly name: "r2" | "firebase";
  getUploadUrl(params: UploadParams): Promise<UploadResult>;
  getDownloadUrl(storageKey: string): Promise<string>;
  deleteObject(storageKey: string): Promise<void>;
}

/** Placeholder R2 provider — Cloud Functions will mint signed URLs. */
export class CloudflareR2Provider implements StorageProvider {
  readonly name = "r2" as const;

  async getUploadUrl(params: UploadParams): Promise<UploadResult> {
    const folder = params.folder ?? "documents";
    const storageKey = `${params.uid}/${folder}/${Date.now()}-${params.fileName}`;
    // In production this calls a Cloud Function / Worker that returns a signed PUT URL.
    return {
      storageKey,
      provider: "r2",
      uploadUrl: `/api/storage/upload?key=${encodeURIComponent(storageKey)}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  async getDownloadUrl(storageKey: string): Promise<string> {
    return `/api/storage/download?key=${encodeURIComponent(storageKey)}`;
  }

  async deleteObject(_storageKey: string): Promise<void> {
    // Implemented via Cloud Function / Worker
  }
}

/** Firebase Storage provider for simpler all-Firebase setups. */
export class FirebaseStorageProvider implements StorageProvider {
  readonly name = "firebase" as const;

  async getUploadUrl(params: UploadParams): Promise<UploadResult> {
    const folder = params.folder ?? "documents";
    const storageKey = `${params.uid}/${folder}/${Date.now()}-${params.fileName}`;
    return {
      storageKey,
      provider: "firebase",
      uploadUrl: `gs://bucket/${storageKey}`,
    };
  }

  async getDownloadUrl(storageKey: string): Promise<string> {
    return `https://firebasestorage.googleapis.com/v0/b/bucket/o/${encodeURIComponent(storageKey)}`;
  }

  async deleteObject(_storageKey: string): Promise<void> {
    // Implemented via Firebase SDK / Functions
  }
}

let activeProvider: StorageProvider = new CloudflareR2Provider();

export function getStorageProvider(): StorageProvider {
  return activeProvider;
}

export function setStorageProvider(provider: StorageProvider): void {
  activeProvider = provider;
}
