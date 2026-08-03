import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/page";
import {
  AlertCircle,
  BookOpen,
  ChartColumn,
  CheckSquare,
  ClipboardList,
  FolderOpen,
  Settings,
} from "lucide-react";
import { useData } from "@/providers/data-provider";
import { LogoutButton } from "@/components/auth/logout-button";

const links = [
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/exams", label: "Exams", icon: ClipboardList },
  { to: "/errors", label: "Error Log", icon: AlertCircle },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MorePage() {
  const { state } = useData();
  const profile = state.profile;

  return (
    <div>
      <PageHeader title="More" description="Các mục còn lại trên mobile." />

      {profile ? (
        <div className="mb-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
          <p className="font-semibold text-ink-900">{profile.displayName}</p>
          {profile.email ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{profile.email}</p>
          ) : null}
          <LogoutButton variant="destructive" className="mt-3 w-full" />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-5 shadow-soft transition hover:shadow-lift"
          >
            <item.icon className="h-6 w-6 text-primary" />
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
