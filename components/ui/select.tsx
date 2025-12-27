"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

/**
 * Select component using Base UI with Plangrove styling.
 * Organic dropdown with smooth animations.
 */

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({
  value,
  onValueChange,
  placeholder = "Select...",
  children,
  disabled,
}: SelectProps) {
  // Wrapper to handle Base UI's nullable value
  const handleValueChange = (newValue: string | null) => {
    if (newValue !== null && onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <BaseSelect.Root
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <BaseSelect.Trigger
        className={cn(
          "flex h-11 w-full items-center justify-between",
          "rounded-xl px-4 py-2",
          "bg-cream-100 text-foreground",
          "border border-border",
          "text-sm",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "focus:border-primary focus:bg-cream-50",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <BaseSelect.Value>
          {(state) => state.value || <span className="text-muted-foreground">{placeholder}</span>}
        </BaseSelect.Value>
        <BaseSelect.Icon>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner>
          <BaseSelect.Popup
            className={cn(
              "z-50 min-w-[8rem] overflow-hidden",
              "rounded-xl bg-card",
              "border border-border/50 shadow-lifted",
              "p-1"
            )}
          >
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SelectItem({ value, children, disabled }: SelectItemProps) {
  return (
    <BaseSelect.Item
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center",
        "rounded-lg py-2.5 pl-10 pr-4",
        "text-sm",
        "outline-none",
        "transition-colors",
        "focus:bg-sage-100 focus:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[highlighted]:bg-sage-100"
      )}
    >
      <BaseSelect.ItemIndicator className="absolute left-3 flex items-center justify-center">
        <Check className="h-4 w-4 text-primary" />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

export function SelectGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("py-1", className)} {...props} />;
}

export function SelectLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
