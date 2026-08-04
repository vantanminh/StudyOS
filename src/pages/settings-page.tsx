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
import { mergePreferences } from "@/lib/preferences";

export function SettingsPage() {
  const { state, updateProfile, updatePreferences, exportJson, resetDemo } =
    useData();
  const profile = state.profile;
  const prefs = mergePreferences(state.preferences, profile);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [weeklyHours, setWeeklyHours] = useState(
    profile?.weeklyTargetHours ?? prefs.weeklyTargetHours,
  );
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(prefs.maxHoursPerDay);
  const [windowStart, setWindowStart] = useState(
    profile?.dailyStudyWindowStart ?? "19:00",
  );
  const [windowEnd, setWindowEnd] = useState(
    profile?.dailyStudyWindowEnd ?? "22:00",
  );
  const [aiEnabled, setAiEnabled] = useState(profile?.aiEnabled ?? false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile?.notificationsEnabled ?? true,
  );
  const [autoReviewFromErrors, setAutoReviewFromErrors] = useState(
    prefs.autoReviewFromErrors,
  );
  const [autoReviewFromWeakTopics, setAutoReviewFromWeakTopics] = useState(
    prefs.autoReviewFromWeakTopics,
  );

  if (!profile) return null;

  async function requestBrowserNotify() {
    if (typeof Notification === "undefined") {
      toast.message("Trình duyệt không hỗ trợ Notification API.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      toast.success("Đã bật thông báo trình duyệt (tuỳ chọn).");
    } else {
      toast.message("Vẫn dùng nhắc in-app trên Today / shell.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Settings"
        description="Hồ sơ, sở thích học tập, automation, AI và dữ liệu cá nhân."
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
                updateProfile({
                  displayName,
                  weeklyTargetHours: weeklyHours,
                  dailyStudyWindowStart: windowStart,
                  dailyStudyWindowEnd: windowEnd,
                  aiEnabled,
                  notificationsEnabled,
                });
                updatePreferences({
                  weeklyTargetHours: weeklyHours,
                  maxHoursPerDay,
                  autoReviewFromErrors,
                  autoReviewFromWeakTopics,
                });
                toast.success("Đã lưu hồ sơ & preferences");
              }}
            >
              Lưu hồ sơ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Preferences</CardTitle>
            <CardDescription>
              Giới hạn ngày, khung giờ học, và auto-review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Giờ mục tiêu / tuần</Label>
                <Input
                  type="number"
                  min={1}
                  max={80}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tối đa giờ / ngày</Label>
                <Input
                  type="number"
                  min={0.5}
                  max={16}
                  step={0.5}
                  value={maxHoursPerDay}
                  onChange={(e) => setMaxHoursPerDay(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ws">Khung giờ bắt đầu</Label>
                <Input
                  id="ws"
                  type="time"
                  value={windowStart}
                  onChange={(e) => setWindowStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="we">Khung giờ kết thúc</Label>
                <Input
                  id="we"
                  type="time"
                  value={windowEnd}
                  onChange={(e) => setWindowEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-3 py-2">
              <div>
                <p className="font-semibold">Auto-review từ lỗi</p>
                <p className="text-sm text-muted-foreground">
                  Tạo ReviewItem khi ghi lỗi (nếu chưa có).
                </p>
              </div>
              <Switch
                checked={autoReviewFromErrors}
                onCheckedChange={setAutoReviewFromErrors}
                aria-label="Auto review từ lỗi"
              />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 px-3 py-2">
              <div>
                <p className="font-semibold">Auto-review chủ đề yếu</p>
                <p className="text-sm text-muted-foreground">
                  Topic mastery thấp / needs_review → hàng đợi ôn.
                </p>
              </div>
              <Switch
                checked={autoReviewFromWeakTopics}
                onCheckedChange={setAutoReviewFromWeakTopics}
                aria-label="Auto review chủ đề yếu"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Nhắc trong khung giờ học, task đến hạn, review due (in-app).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Bật nhắc học</p>
                <p className="text-sm text-muted-foreground">
                  Hiển thị trên Today / shell khi mở app.
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                aria-label="Bật nhắc học"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={requestBrowserNotify}>
              Xin quyền thông báo trình duyệt
            </Button>
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
                AI chỉ gọi qua Cloudflare Worker (OpenRouter) — không gọi model
                từ browser. Weekly plan & NL quick-add cần bật công tắc này.
              </p>
            </div>
            <Switch
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
              aria-label="Bật AI"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>
              Xuất hoặc xóa dữ liệu workspace — không đăng xuất.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                const blob = new Blob([exportJson()], {
                  type: "application/json",
                });
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
