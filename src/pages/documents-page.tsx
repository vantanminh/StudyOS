import { useState } from "react";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { getStorageProvider } from "@/lib/storage/provider";
import { toast } from "sonner";
import { useData } from "@/providers/data-provider";

interface LocalDoc {
  id: string;
  name: string;
  storageKey: string;
  provider: string;
}

export function DocumentsPage() {
  const { state } = useData();
  const [docs, setDocs] = useState<LocalDoc[]>([]);

  async function handleUpload(file: File) {
    const provider = getStorageProvider();
    const result = await provider.getUploadUrl({
      uid: state.profile?.uid ?? "demo-user",
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      folder: "documents",
    });
    setDocs((prev) => [
      {
        id: result.storageKey,
        name: file.name,
        storageKey: result.storageKey,
        provider: result.provider,
      },
      ...prev,
    ]);
    toast.success(`Đã chuẩn bị upload qua ${result.provider.toUpperCase()}`);
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Tài liệu học tập qua StorageProvider (R2 mặc định, Firebase Storage tuỳ chọn)."
        actions={
          <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
            Upload
          </label>
        }
      />

      {docs.length === 0 ? (
        <EmptyState
          title="Chưa có tài liệu"
          description="Upload PDF, ảnh đề hoặc audio IELTS. File không đi vào frontend bundle."
        />
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.provider} · {doc.storageKey}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
