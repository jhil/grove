"use client";

import { cn } from "@/lib/utils";
import { useSortOption, SORT_OPTIONS, type SortOption } from "@/hooks/use-sort";
import { ArrowUpDown, Check } from "lucide-react";
import { useState } from "react";

/**
 * Sort selector dropdown.
 */
interface SortSelectorProps {
  groveId: string;
  className?: string;
}

export function SortSelector({ groveId, className }: SortSelectorProps) {
  const { sortOption, setSortOption } = useSortOption(groveId);
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortOption)?.label || "Sort";

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
          "bg-cream-100/80 backdrop-blur-sm hover:bg-cream-200/80",
          "text-sage-600"
        )}
      >
        <ArrowUpDown className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLabel}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-xl shadow-lifted border border-border/50 py-1 min-w-[160px]">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortOption(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-2",
                  "hover:bg-sage-50 transition-colors",
                  sortOption === option.value && "text-sage-700 font-medium"
                )}
              >
                {option.label}
                {sortOption === option.value && (
                  <Check className="w-4 h-4 text-sage-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
