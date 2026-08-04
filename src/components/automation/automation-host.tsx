import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useData } from "@/providers/data-provider";
import type { StudyReminder } from "@/lib/automation";
import { Button } from "@/components/ui/button";
import { X, Bell } from "lucide-react";

const REMINDER_REFRESH_MS = 60_000;

/**
 * Runs Phase 4 automation for an authenticated session:
 * auto-overdue, auto-review drafts, and in-app "nhắc học" chips.
 * Re-runs when notification prefs flip on, and refreshes periodically
 * so study-window reminders appear without a full page reload.
 */
export function AutomationHost() {
  const { state, runAutomation, dismissReminder, authReady, isAuthenticated } =
    useData();
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const booted = useRef(false);
  const lastNotif = useRef<boolean | null>(null);
  const navigate = useNavigate();

  const sessionReady =
    authReady &&
    isAuthenticated &&
    Boolean(state.profile?.onboardingCompleted);

  const applyPass = useCallback(
    (opts?: { announce?: boolean }) => {
      const result = runAutomation();
      setReminders(result.reminders);

      if (opts?.announce) {
        if (result.overdueCount > 0) {
          toast.message(`Đã đánh dấu ${result.overdueCount} task quá hạn`);
        }
        if (result.reviewCount > 0) {
          toast.success(
            `Tự tạo ${result.reviewCount} mục ôn từ lỗi / chủ đề yếu`,
          );
        }
      }

      if (
        state.profile?.notificationsEnabled &&
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        const top = result.reminders[0];
        if (top && opts?.announce) {
          try {
            new Notification(top.title, { body: top.body, tag: top.id });
          } catch {
            /* ignore unsupported environments */
          }
        }
      }

      return result;
    },
    [runAutomation, state.profile?.notificationsEnabled],
  );

  // Initial automation tick once the workspace is ready.
  useEffect(() => {
    if (!sessionReady) return;
    if (booted.current) return;
    booted.current = true;
    lastNotif.current = state.profile?.notificationsEnabled ?? null;
    applyPass({ announce: true });
  }, [sessionReady, applyPass, state.profile?.notificationsEnabled]);

  // Re-run when "Bật nhắc học" is toggled (clear when off, refresh when on).
  useEffect(() => {
    if (!sessionReady || !booted.current) return;
    const enabled = state.profile?.notificationsEnabled ?? false;
    if (lastNotif.current === enabled) return;
    lastNotif.current = enabled;
    if (!enabled) {
      setReminders([]);
      return;
    }
    applyPass({ announce: false });
  }, [sessionReady, state.profile?.notificationsEnabled, applyPass]);

  // Periodic silent refresh (study window / due reviews / overdue).
  useEffect(() => {
    if (!sessionReady) return;
    const id = window.setInterval(() => {
      applyPass({ announce: false });
    }, REMINDER_REFRESH_MS);
    return () => window.clearInterval(id);
  }, [sessionReady, applyPass]);

  // Reset on logout so the next session boots automation again.
  useEffect(() => {
    if (!isAuthenticated) {
      booted.current = false;
      lastNotif.current = null;
      setReminders([]);
    }
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
