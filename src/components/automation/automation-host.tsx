import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useData } from "@/providers/data-provider";
import type { StudyReminder } from "@/lib/automation";
import { Button } from "@/components/ui/button";
import { X, Bell } from "lucide-react";

/**
 * Runs Phase 4 automation once per authenticated session and shows
 * in-app reminder chips. Optional browser Notification when permitted.
 */
export function AutomationHost() {
  const { state, runAutomation, dismissReminder, authReady, isAuthenticated } =
    useData();
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const ran = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authReady || !isAuthenticated || !state.profile?.onboardingCompleted) {
      return;
    }
    if (ran.current) return;
    ran.current = true;

    const result = runAutomation();
    setReminders(result.reminders);

    if (result.overdueCount > 0) {
      toast.message(`Đã đánh dấu ${result.overdueCount} task quá hạn`);
    }
    if (result.reviewCount > 0) {
      toast.success(`Tự tạo ${result.reviewCount} mục ôn từ lỗi / chủ đề yếu`);
    }

    if (
      state.profile.notificationsEnabled &&
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      const top = result.reminders[0];
      if (top) {
        try {
          new Notification(top.title, { body: top.body, tag: top.id });
        } catch {
          /* ignore unsupported environments */
        }
      }
    }
  }, [
    authReady,
    isAuthenticated,
    state.profile?.onboardingCompleted,
    state.profile?.notificationsEnabled,
    runAutomation,
  ]);

  // Reset run flag on logout
  useEffect(() => {
    if (!isAuthenticated) ran.current = false;
  }, [isAuthenticated]);

  if (reminders.length === 0) return null;

  return (
    <div
      className="mb-4 space-y-2 rounded-2xl border border-border/60 bg-butter-soft/40 p-3"
      role="status"
      aria-label="Nhắc học"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
        <Bell className="h-4 w-4" />
        Nhắc nhở
      </div>
      <ul className="space-y-2">
        {reminders.map((r) => (
          <li
            key={r.id}
            className="flex items-start justify-between gap-2 rounded-xl bg-card/80 px-3 py-2"
          >
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => r.href && navigate(r.href)}
            >
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.body}</p>
            </button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Đóng nhắc"
              onClick={() => {
                dismissReminder(r.id);
                setReminders((prev) => prev.filter((x) => x.id !== r.id));
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
