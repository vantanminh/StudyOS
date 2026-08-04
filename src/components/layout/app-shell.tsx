import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ChartColumn,
  CheckSquare,
  CircleHelp,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/providers/data-provider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QuickAddDialog } from "@/components/tasks/quick-add-dialog";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/auth/logout-button";
import { AutomationHost } from "@/components/automation/automation-host";

const desktopNav = [
  { to: "/today", label: "Today", icon: LayoutDashboard },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/review", label: "Review", icon: RefreshCw },
  { to: "/exams", label: "Exams", icon: ClipboardList },
  { to: "/errors", label: "Error Log", icon: AlertCircle },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/help", label: "Hướng dẫn", icon: CircleHelp },
  { to: "/settings", label: "Settings", icon: Settings },
];

const mobileNav = [
  { to: "/today", label: "Today", icon: LayoutDashboard },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "__add__", label: "Add", icon: Plus },
  { to: "/review", label: "Review", icon: RefreshCw },
  { to: "/more", label: "More", icon: MoreHorizontal },
];

export function AppShell() {
  const { state } = useData();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1440px]">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border/60 bg-card/70 px-4 py-6 backdrop-blur-sm lg:flex">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-soft shadow-soft">
              <FileText className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink-900">StudyOS</p>
              <p className="text-xs text-muted-foreground">Không gian học tập dịu dàng</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Điều hướng chính">
          {desktopNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-sage-soft text-ink-900 shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 space-y-2 rounded-2xl bg-peach-soft/60 p-4">
          <div>
            <p className="text-xs font-semibold text-ink-800">
              {state.profile?.displayName ?? "Bạn"}
            </p>
            {state.profile?.email ? (
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {state.profile.email}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">
              Đồng bộ:{" "}
              <Badge variant={state.syncStatus === "synced" ? "success" : "warn"}>
                {state.syncStatus === "synced"
                  ? "Đã đồng bộ"
                  : state.syncStatus === "pending"
                    ? "Đang chờ"
                    : "Thất bại"}
              </Badge>
            </p>
          </div>
          <Button
            className="w-full"
            size="sm"
            variant="secondary"
            onClick={() => setQuickAddOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </Button>
          <LogoutButton variant="outline" size="sm" className="w-full" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-soft">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-semibold">StudyOS</span>
          </div>
          <Button size="sm" onClick={() => setQuickAddOpen(true)} aria-label="Thêm nhanh">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <AutomationHost />
          <Outlet key={location.pathname} />
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
        aria-label="Điều hướng mobile"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1">
          {mobileNav.map((item) => {
            if (item.to === "__add__") {
              return (
                <li key={item.to} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(true)}
                    className="-mt-5 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lift"
                    aria-label="Thêm task"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                </li>
              );
            }
            const active =
              location.pathname === item.to ||
              (item.to === "/more" &&
                ["/subjects", "/tasks", "/exams", "/errors", "/analytics", "/documents", "/help", "/settings"].some(
                  (p) => location.pathname.startsWith(p),
                ));
            return (
              <li key={item.to} className="flex-1">
                <button
                  type="button"
                  onClick={() => navigate(item.to)}
                  className={cn(
                    "flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-semibold",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <QuickAddDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </div>
  );
}
