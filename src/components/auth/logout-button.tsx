import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/providers/data-provider";
import { isDemoMode } from "@/lib/firebase";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  /** Visual style of the trigger button. */
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  /** Hide the LogOut icon (e.g. dense menus). */
  hideIcon?: boolean;
  /** Override default label. */
  label?: string;
};

export function LogoutButton({
  variant = "outline",
  size = "default",
  className,
  hideIcon = false,
  label = "Đăng xuất",
}: LogoutButtonProps) {
  const { logout, state } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await logout();
      setOpen(false);
      toast.success("Đã đăng xuất");
      navigate("/login", { replace: true });
    } catch (cause) {
      const message =
        cause && typeof cause === "object" && "code" in cause
          ? String((cause as { code: string }).code)
          : cause instanceof Error
            ? cause.message
            : "Không thể đăng xuất. Thử lại.";
      toast.error(
        message === "auth/network-request-failed"
          ? "Lỗi mạng khi đăng xuất. Kiểm tra kết nối rồi thử lại."
          : message.startsWith("auth/")
            ? "Không thể đăng xuất. Thử lại sau."
            : message,
      );
    } finally {
      setBusy(false);
    }
  }

  const email = state.profile?.email;
  const name = state.profile?.displayName;

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={() => setOpen(true)}
        disabled={busy}
      >
        {!hideIcon && <LogOut className="h-4 w-4" />}
        {label}
      </Button>

      <Dialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng xuất?</DialogTitle>
            <DialogDescription>
              {isDemoMode
                ? "Phiên local trên thiết bị này sẽ kết thúc. Dữ liệu demo trên máy sẽ bị xóa khỏi phiên hiện tại."
                : "Bạn sẽ thoát tài khoản StudyOS trên thiết bị này. Dữ liệu đám mây vẫn được giữ nguyên."}
              {(name || email) && (
                <span className="mt-2 block text-foreground">
                  {name}
                  {email ? ` · ${email}` : ""}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={busy}
              onClick={() => void handleConfirm()}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Đăng xuất
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
