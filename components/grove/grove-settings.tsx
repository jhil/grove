"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorThemePicker } from "@/components/grove/color-theme-picker";
import { useUpdateGrove, useDeleteGrove } from "@/hooks/use-grove";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Settings, Trash2, AlertTriangle, Users, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Grove } from "@/types/supabase";
import type { ThemeId } from "@/lib/constants/themes";
import { DEFAULT_THEME } from "@/lib/constants/themes";

/**
 * Grove settings dialog.
 * Allows editing grove name, care mode, and deletion.
 */
interface GroveSettingsProps {
  grove: Grove;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroveSettings({ grove, open, onOpenChange }: GroveSettingsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const updateGrove = useUpdateGrove();
  const deleteGrove = useDeleteGrove();

  const [name, setName] = useState(grove.name);
  const [careMode, setCareMode] = useState<"collaborative" | "single">("collaborative");
  const [colorTheme, setColorTheme] = useState<ThemeId>(
    (grove.color_theme as ThemeId) || DEFAULT_THEME
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateGrove.mutateAsync({
        id: grove.id,
        updates: { name: name.trim(), color_theme: colorTheme },
      });
      showToast("Grove updated!", "success");
      onOpenChange(false);
    } catch {
      showToast("Failed to update grove", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGrove.mutateAsync(grove.id);
      showToast("Grove deleted", "success");
      router.push("/");
    } catch {
      showToast("Failed to delete grove", "error");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Grove Settings"
      description="Manage your grove preferences"
    >
      <div className="space-y-6">
        {/* Grove Name */}
        <div className="space-y-2">
          <label htmlFor="grove-name" className="text-sm font-medium text-foreground">
            Grove Name
          </label>
          <Input
            id="grove-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Plant Grove"
            maxLength={50}
          />
        </div>

        {/* Color Theme */}
        <ColorThemePicker value={colorTheme} onChange={setColorTheme} disabled={isSubmitting} />

        {/* Care Mode */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Care Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <CareModeOption
              icon={Users}
              title="Collaborative"
              description="Everyone can water and edit"
              selected={careMode === "collaborative"}
              onClick={() => setCareMode("collaborative")}
            />
            <CareModeOption
              icon={User}
              title="Owner Only"
              description="Only you can make changes"
              selected={careMode === "single"}
              onClick={() => setCareMode("single")}
              disabled
              comingSoon
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-destructive mb-3">Danger Zone</h4>
          {showDeleteConfirm ? (
            <div className="bg-destructive/10 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Delete this grove?
                  </p>
                  <p className="text-xs text-destructive/80 mt-1">
                    This will permanently delete the grove and all its plants. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Deleting..." : "Delete Forever"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Grove
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}

/**
 * Care mode selection option.
 */
interface CareModeOptionProps {
  icon: typeof Users;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

function CareModeOption({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  disabled,
  comingSoon,
}: CareModeOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative p-4 rounded-xl border-2 text-left transition-all",
        selected
          ? "border-terracotta-500 bg-terracotta-50"
          : "border-cream-200 hover:border-terracotta-300",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {comingSoon && (
        <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-clay-400/20 text-clay-600">
          Soon
        </span>
      )}
      <Icon className={cn("w-5 h-5 mb-2", selected ? "text-terracotta-600" : "text-terracotta-400")} />
      <p className="font-medium text-sm text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </button>
  );
}

/**
 * Settings button to trigger the dialog.
 */
interface GroveSettingsButtonProps {
  grove: Grove;
  className?: string;
}

export function GroveSettingsButton({ grove, className }: GroveSettingsButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className={cn("text-terracotta-400 hover:text-terracotta-600", className)}
      >
        <Settings className="w-5 h-5" />
      </Button>
      <GroveSettings grove={grove} open={open} onOpenChange={setOpen} />
    </>
  );
}
