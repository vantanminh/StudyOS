import { useData } from "@/providers/data-provider";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { LogoutButton } from "@/components/auth/logout-button";
import { isDemoMode } from "@/lib/firebase";

export function SettingsPage() {
  const { state, updateProfile, exportJson, resetDemo } = useData();
  const profile = state.profile;
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [weeklyHours, setWeeklyHours] = useState(profile?.weeklyTargetHours ?? 20);
  const [aiEnabled, setAiEnabled] = useState(profile?.aiEnabled ?? false);

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Settings"
        description="Hồ sơ, sở thích học tập, AI và dữ liệu cá nhân."
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tài khoản</CardTitle>
            <CardDescription>
              {isDemoMode
                ? "Chế độ local trên thiết bị này."
                : "Phiên đăng nhập Firebase của bạn."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border/60 bg-cream-50/80 px-4 py-3 text-sm">
              <p className="font-semibold text-ink-900">{profile.displayName}</p>
              {profile.email ? (
                <p className="mt-0.5 text-muted-foreground">{profile.email}</p>
              ) : null}
            </div>
            <LogoutButton variant="destructive" className="w-full sm:w-auto" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Múi giờ</Label>
                <Input value={profile.timezone} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Ngôn ngữ</Label>
                <Input value={profile.locale} readOnly />
              </div>
            </div>
            <Button
              onClick={() => {
                updateProfile({ displayName, weeklyTargetHours: weeklyHours, aiEnabled });
                toast.success("Đã lưu hồ sơ");
              }}
            >
              Lưu hồ sơ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Giờ mục tiêu / tuần</Label>
              <Input
                type="number"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Khung giờ: {profile.dailyStudyWindowStart} – {profile.dailyStudyWindowEnd} ·
              Pomodoro mặc định 25/5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Bật AI assistant</p>
              <p className="text-sm text-muted-foreground">
                AI chỉ gọi qua Cloud Functions — không gọi trực tiếp từ frontend.
              </p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} aria-label="Bật AI" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>Xuất hoặc xóa dữ liệu workspace — không đăng xuất.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                const blob = new Blob([exportJson()], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `studyos-export-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Đã export JSON");
              }}
            >
              Export JSON
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                resetDemo();
                toast.message("Đã xóa dữ liệu — thiết lập lại từ đầu");
              }}
            >
              Xóa dữ liệu & bắt đầu lại
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
