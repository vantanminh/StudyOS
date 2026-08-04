/**
 * StorageProvider — Cloudflare R2 via StudyOS Worker (no Firebase Storage / Blaze).
 * Upload path: presign → PUT /api/storage/objects (Worker streams into R2 binding).
 */

import { isDemoMode } from "@/lib/firebase";
import { apiBaseUrl, getIdToken, workerJson } from "@/lib/api/worker-client";

export interface UploadParams {
  uid: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  folder?: "documents" | "images" | "audio";
}

export interface UploadResult {
  storageKey: string;
  provider: "r2";
  uploadUrl: string;
  publicUrl?: string;
  expiresAt?: string;
  method?: "PUT";
  headers?: Record<string, string>;
}

export interface StorageProvider {
  readonly name: "r2";
  /** Mint upload target (does not transfer bytes). */
  getUploadUrl(params: UploadParams): Promise<UploadResult>;
  /** Presign + PUT file body to R2 via Worker. */
  uploadFile(params: UploadParams, file: Blob): Promise<UploadResult>;
  getDownloadUrl(storageKey: string): Promise<string>;
  /** Fetch object bytes (authenticated). */
  downloadBlob(storageKey: string): Promise<Blob>;
  deleteObject(storageKey: string): Promise<void>;
}

interface PresignResponse {
  storageKey: string;
  provider: "r2";
  method: "PUT";
  uploadUrl: string;
  headers?: Record<string, string>;
  expiresAt?: string;
  maxBytes?: number;
}

function resolveUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${apiBaseUrl()}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Demo / offline: no network, local object URLs only for UI smoke tests. */
class DemoStorageProvider implements StorageProvider {
  readonly name = "r2" as const;
  private store = new Map<string, Blob>();

  async getUploadUrl(params: UploadParams): Promise<UploadResult> {
    const folder = params.folder ?? "documents";
    const storageKey = `${params.uid}/${folder}/${Date.now()}-${params.fileName}`;
    return {
      storageKey,
      provider: "r2",
      method: "PUT",
      uploadUrl: `demo://${storageKey}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  async uploadFile(params: UploadParams, file: Blob): Promise<UploadResult> {
    const meta = await this.getUploadUrl(params);
    this.store.set(meta.storageKey, file);
    return meta;
  }

  async getDownloadUrl(storageKey: string): Promise<string> {
    const blob = this.store.get(storageKey);
    if (!blob) return `demo://${storageKey}`;
    return URL.createObjectURL(blob);
  }

  async downloadBlob(storageKey: string): Promise<Blob> {
    const blob = this.store.get(storageKey);
    if (!blob) throw new Error("File demo không tồn tại.");
    return blob;
  }

  async deleteObject(storageKey: string): Promise<void> {
    this.store.delete(storageKey);
  }
}

/** Production R2 via Cloudflare Worker. */
export class CloudflareR2Provider implements StorageProvider {
  readonly name = "r2" as const;

  async getUploadUrl(params: UploadParams): Promise<UploadResult> {
    const data = await workerJson<PresignResponse>("/api/storage/presign", {
      method: "POST",
      body: JSON.stringify({
        fileName: params.fileName,
        contentType: params.contentType,
        sizeBytes: params.sizeBytes,
        folder: params.folder ?? "documents",
      }),
    });
    return {
      storageKey: data.storageKey,
      provider: "r2",
      method: "PUT",
      uploadUrl: data.uploadUrl,
      headers: data.headers,
      expiresAt: data.expiresAt,
    };
  }

  async uploadFile(params: UploadParams, file: Blob): Promise<UploadResult> {
    const meta = await this.getUploadUrl({
      ...params,
      sizeBytes: params.sizeBytes || file.size,
      contentType: params.contentType || file.type || "application/octet-stream",
    });

    const token = await getIdToken();
    const headers = new Headers(meta.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type")) {
      headers.set(
        "Content-Type",
        params.contentType || file.type || "application/octet-stream",
      );
    }

    const res = await fetch(resolveUrl(meta.uploadUrl), {
      method: "PUT",
      headers,
      body: file,
    });

    if (!res.ok) {
      let message = `Upload thất bại (${res.status})`;
      try {
        const err = (await res.json()) as { error?: string };
        if (err.error) message = err.error;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    return meta;
  }

  async getDownloadUrl(storageKey: string): Promise<string> {
    return resolveUrl(
      `/api/storage/objects?key=${encodeURIComponent(storageKey)}`,
    );
  }

  async downloadBlob(storageKey: string): Promise<Blob> {
    const token = await getIdToken();
    const res = await fetch(await this.getDownloadUrl(storageKey), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw new Error(`Tải file thất bại (${res.status})`);
    }
    return res.blob();
  }

  async deleteObject(storageKey: string): Promise<void> {
    await workerJson(`/api/storage/objects?key=${encodeURIComponent(storageKey)}`, {
      method: "DELETE",
    });
  }
}

let activeProvider: StorageProvider = isDemoMode
  ? new DemoStorageProvider()
  : new CloudflareR2Provider();

export function getStorageProvider(): StorageProvider {
  return activeProvider;
}

export function setStorageProvider(provider: StorageProvider): void {
  activeProvider = provider;
}
