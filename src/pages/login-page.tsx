import { useNavigate } from "react-router-dom";
import { useData } from "@/providers/data-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";

export function LoginPage() {
  const { loginDemo, isAuthenticated, state } = useData();
  const navigate = useNavigate();
  const [name, setName] = useState("Minh");
  const [email, setEmail] = useState("ban@studyos.local");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (state.profile?.onboardingCompleted) {
      navigate("/today", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }, [isAuthenticated, state.profile?.onboardingCompleted, navigate]);

  function handleDemoLogin() {
    loginDemo(name.trim() || "Minh");
    navigate("/today");
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
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên hiển thị</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên của bạn"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleDemoLogin}>
            <Sparkles className="h-4 w-4" />
            Vào không gian học tập
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Chế độ demo lưu dữ liệu trên thiết bị. Kết nối Firebase Auth (Google / Email)
            khi sẵn sàng production.
          </p>
        </div>
      </div>
    </div>
  );
}
