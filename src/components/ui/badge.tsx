import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "outline" | "danger" | "success" | "warn";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "bg-primary/15 text-primary",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "outline" && "border border-border text-foreground",
        variant === "danger" && "bg-rose-soft text-destructive",
        variant === "success" && "bg-sage-soft text-primary",
        variant === "warn" && "bg-butter-soft text-ink-800",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
