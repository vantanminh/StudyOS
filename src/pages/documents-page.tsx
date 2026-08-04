import { useState } from "react";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStorageProvider } from "@/lib/storage/provider";
import { toast } from "sonner";
import { useData } from "@/providers/data-provider";
import { isDemoMode } from "@/lib/firebase";
import { Download, Trash2 } from "lucide-react";

interface LocalDoc {
  id: string;
  name: string;
  storageKey: string;
  provider: string;
  sizeBytes: number;
}

export function DocumentsPage() {
  const { state } = useData();
  const [docs, setDocs] = useState<LocalDoc[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    const uid = state.profile?.uid;
    if (!uid && !isDemoMode) {
      toast.error("Cần đăng nhập để upload.");
      return;
    }
    setUploading(true);
    try {
      const provider = getStorageProvider();
      const result = await provider.uploadFile(
        {
          uid: uid ?? "demo-user",
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          folder: "documents",
        },
        file,
      );
      setDocs((prev) => [
        {
          id: result.storageKey,
          name: file.name,
          storageKey: result.storageKey,
          provider: result.provider,
          sizeBytes: file.size,
        },
        ...prev,
      ]);
      toast.success(
        isDemoMode
          ? "Đã lưu tài liệu (demo local)"
          : "Đã upload lên Cloudflare R2",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(doc: LocalDoc) {
    try {
      const blob = await getStorageProvider().downloadBlob(doc.storageKey);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải file thất bại");
    }
  }

  async function handleDelete(doc: LocalDoc) {
    try {
      await getStorageProvider().deleteObject(doc.storageKey);
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
      toast.success("Đã xóa tài liệu");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xóa thất bại");
    }
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Tài liệu học tập lưu trên Cloudflare R2 qua Worker (không dùng Firebase Storage)."
        actions={
          <label
            className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
            {uploading ? "Đang upload…" : "Upload"}
          </label>
        }
      />

      {docs.length === 0 ? (
        <EmptyState
          title="Chưa có tài liệu"
          description="Upload PDF, ảnh đề hoặc audio IELTS. File đi qua Worker → R2, không qua Firebase Storage."
        />
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.provider.toUpperCase()} ·{" "}
                    {(doc.sizeBytes / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => void handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                    Tải
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void handleDelete(doc)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
