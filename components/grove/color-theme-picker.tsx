"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { THEMES, type ThemeId } from "@/lib/constants/themes";
import { applyTheme } from "@/hooks/use-grove-theme";
import { Button } from "@/components/ui/button";

interface ColorThemePickerProps {
  value: ThemeId;
  onChange: (themeId: ThemeId) => void;
  disabled?: boolean;
}

/**
 * Color theme picker component for selecting grove themes
 */
export function ColorThemePicker({
  value,
  onChange,
  disabled = false,
}: ColorThemePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTheme = (themeId: ThemeId) => {
    onChange(themeId);
    applyTheme(themeId);
    setIsOpen(false);
  };

  const currentTheme = THEMES[value];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Grove Color Theme</label>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors[400]} 0%, ${currentTheme.colors[500]} 100%)`,
            }}
          />
          <span className="text-sm font-medium">{currentTheme.emoji} {currentTheme.name}</span>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 gap-2 p-3 border border-border rounded-lg bg-card">
          {Object.values(THEMES).map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg transition-all",
                "border-2 hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                value === theme.id
                  ? "border-ring bg-secondary"
                  : "border-border hover:border-sage-300"
              )}
              title={theme.description}
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors[400]} 0%, ${theme.colors[500]} 100%)`,
                }}
              />
              <div className="text-left">
                <div className="text-sm font-medium">{theme.emoji} {theme.name}</div>
                <div className="text-xs text-muted-foreground">{theme.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
