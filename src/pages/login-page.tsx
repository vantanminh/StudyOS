import { useNavigate } from "react-router-dom";
import { useData } from "@/providers/data-provider";
import { isDemoMode, hasFirebaseConfig } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { BookOpen, Loader2, Sparkles } from "lucide-react";

function mapAuthError(cause: unknown): string {
  const code =
    cause && typeof cause === "object" && "code" in cause
      ? String((cause as { code: string }).code)
      : "";
  switch (code) {
    case "auth/popup-closed-by-user":
      return "Bạn đã đóng cửa sổ đăng nhập Google.";
    case "auth/popup-blocked":
      return "Trình duyệt chặn popup. Hãy cho phép popup rồi thử lại.";
    case "auth/unauthorized-domain":
      return "Domain này chưa được phép đăng nhập Google. Thêm domain vào Firebase Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "Google Sign-In chưa bật trong Firebase Console (Authentication → Sign-in method).";
    case "auth/account-exists-with-different-credential":
      return "Email này đã đăng ký bằng phương thức khác. Hãy đăng nhập bằng email/mật khẩu.";
    case "auth/invalid-email":
      return "Email không hợp lệ.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email hoặc mật khẩu không đúng.";
    case "auth/email-already-in-use":
      return "Email đã được sử dụng. Hãy đăng nhập thay vì đăng ký.";
    case "auth/weak-password":
      return "Mật khẩu tối thiểu 6 ký tự.";
    case "auth/network-request-failed":
      return "Lỗi mạng. Kiểm tra kết nối rồi thử lại.";
    default:
      return cause instanceof Error ? cause.message : "Không thể đăng nhập.";
  }
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginPage() {
  const { loginDemo, loginFirebase, loginWithGoogle, isAuthenticated, authReady, state } =
    useData();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"google" | "email" | "demo" | null>(null);

  useEffect(() => {
    if (!authReady || !isAuthenticated) return;
    if (state.profile?.onboardingCompleted) {
      navigate("/today", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }, [authReady, isAuthenticated, state.profile?.onboardingCompleted, navigate]);

  function handleDemoLogin() {
    setError("");
    setBusy("demo");
    try {
      loginDemo(name.trim() || "Học sinh");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể vào demo.");
    } finally {
      setBusy(null);
    }
  }

  async function handleFirebaseLogin() {
    setError("");
    if (!email.trim() || !password) {
      setError("Vui lòng nhập email và mật khẩu để đăng nhập.");
      return;
    }
    if (register && !name.trim()) {
      setError("Vui lòng nhập tên hiển thị khi đăng ký.");
      return;
    }
    setBusy("email");
    try {
      await loginFirebase(email.trim(), password, name, register);
    } catch (cause) {
      setError(mapAuthError(cause));
    } finally {
      setBusy(null);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setBusy("google");
    try {
      await loginWithGoogle();
    } catch (cause) {
      setError(mapAuthError(cause));
    } finally {
      setBusy(null);
    }
  }

  if (!authReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Đang tải" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-sage/30 blur-3xl animate-soft-pulse" />
        <div className="absolute right-0 top-40 h-48 w-48 rounded-full bg-peach/40 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-36 w-36 rounded-full bg-sky/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-lift backdrop-blur-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-sage-soft shadow-soft animate-float">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-semibold text-ink-900">StudyOS</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hệ điều hành học tập dịu dàng cho kỳ thi lớp 12 và IELTS.
          </p>
          {!isDemoMode && (
            <p className="mt-3 text-xs font-medium text-ink-700">
              Bắt buộc đăng nhập — không hỗ trợ dùng khách.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {!isDemoMode && (
            <>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                size="lg"
                disabled={busy !== null}
                onClick={() => void handleGoogleLogin()}
              >
                {busy === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon className="h-5 w-5" />
                )}
                Tiếp tục với Google
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <div className="w-full border-t border-border/70" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">hoặc email</span>
                </div>
              </div>
            </>
          )}

          {(isDemoMode || register) && (
            <div className="space-y-2">
              <Label htmlFor="name">Tên hiển thị</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn"
                disabled={busy !== null}
              />
            </div>
          )}

          {isDemoMode ? null : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  disabled={busy !== null}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  disabled={busy !== null}
                  autoComplete={register ? "new-password" : "current-password"}
                  required
                />
              </div>
            </>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={busy !== null}
            onClick={isDemoMode ? handleDemoLogin : () => void handleFirebaseLogin()}
          >
            {busy === "email" || busy === "demo" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isDemoMode
              ? "Vào không gian học tập (demo local)"
              : register
                ? "Đăng ký bằng email"
                : "Đăng nhập bằng email"}
          </Button>

          {!isDemoMode && (
            <button
              type="button"
              className="w-full text-center text-sm text-primary underline-offset-4 hover:underline disabled:opacity-50"
              disabled={busy !== null}
              onClick={() => setRegister((value) => !value)}
            >
              {register ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
            </button>
          )}

          {!isDemoMode && !hasFirebaseConfig && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-xs text-destructive">
              Chưa cấu hình Firebase (`VITE_FIREBASE_*`). Không thể đăng nhập cho đến khi thêm
              cấu hình vào `.env`.
            </p>
          )}

          {error && <p className="text-center text-sm text-destructive">{error}</p>}

          <p className="text-center text-xs text-muted-foreground">
            {isDemoMode
              ? "Chế độ demo local — chỉ dùng để phát triển, dữ liệu lưu trên thiết bị này."
              : "Cần tài khoản Firebase (Google hoặc email/mật khẩu). Không có chế độ khách."}
          </p>
        </div>
      </div>
    </div>
  );
}
