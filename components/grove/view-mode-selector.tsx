"use client";

import { cn } from "@/lib/utils";
import { useViewMode, type ViewMode } from "@/hooks/use-view-mode";
import { LayoutGrid, List, Rows3 } from "lucide-react";

/**
 * Organic view mode selector.
 * Pill-style toggle for switching between gallery, list, and compact views.
 */
interface ViewModeSelectorProps {
  groveId: string;
  className?: string;
}

export function ViewModeSelector({ groveId, className }: ViewModeSelectorProps) {
  const { viewMode, setViewMode } = useViewMode(groveId);

  const modes: { value: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { value: "gallery", icon: LayoutGrid, label: "Gallery" },
    { value: "list", icon: List, label: "List" },
    { value: "compact", icon: Rows3, label: "Compact" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-full bg-cream-100/80 backdrop-blur-sm",
        className
      )}
    >
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setViewMode(value)}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200",
            viewMode === value
              ? "bg-white text-terracotta-700 shadow-soft"
              : "text-terracotta-500 hover:text-terracotta-600 hover:bg-cream-50"
          )}
          aria-label={label}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
