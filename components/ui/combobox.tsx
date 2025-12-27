"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Search, X } from "lucide-react";

/**
 * Combobox / Autocomplete component.
 * Provides searchable dropdown with keyboard navigation.
 */

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
}

interface ComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  /** Called when search query changes - use for async search */
  onSearch?: (query: string) => void;
  /** Loading state for async search */
  loading?: boolean;
  /** Allow custom values not in the list */
  allowCustom?: boolean;
  /** Max height for dropdown in pixels */
  maxHeight?: number;
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled,
  className,
  onSearch,
  loading,
  allowCustom,
  maxHeight = 300,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on query
  const filteredOptions = React.useMemo(() => {
    if (!query.trim()) return options;

    const normalizedQuery = query.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(normalizedQuery) ||
        opt.description?.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  // Group options
  const groupedOptions = React.useMemo(() => {
    const groups: Map<string | undefined, ComboboxOption[]> = new Map();

    filteredOptions.forEach((opt) => {
      const group = opt.group;
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(opt);
    });

    return groups;
  }, [filteredOptions]);

  // Get flat list of options for keyboard navigation
  const flatOptions = React.useMemo(() => {
    const flat: ComboboxOption[] = [];
    groupedOptions.forEach((opts) => flat.push(...opts));
    return flat;
  }, [groupedOptions]);

  // Handle search change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      setHighlightedIndex(0);
      onSearch?.(newQuery);
    },
    [onSearch]
  );

  // Handle option select
  const handleSelect = useCallback(
    (optionValue: string) => {
      onValueChange?.(optionValue);
      setOpen(false);
      setQuery("");
    },
    [onValueChange]
  );

  // Handle custom value (when allowCustom is true)
  const handleCustomValue = useCallback(() => {
    if (allowCustom && query.trim()) {
      onValueChange?.(query.trim());
      setOpen(false);
      setQuery("");
    }
  }, [allowCustom, query, onValueChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            Math.min(prev + 1, flatOptions.length - 1)
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          break;

        case "Enter":
          e.preventDefault();
          if (flatOptions[highlightedIndex]) {
            handleSelect(flatOptions[highlightedIndex].value);
          } else if (allowCustom && query.trim()) {
            handleCustomValue();
          }
          break;

        case "Escape":
          e.preventDefault();
          setOpen(false);
          setQuery("");
          break;

        case "Tab":
          setOpen(false);
          setQuery("");
          break;
      }
    },
    [open, highlightedIndex, flatOptions, handleSelect, allowCustom, query, handleCustomValue]
  );

  // Scroll highlighted option into view
  useEffect(() => {
    if (open && listRef.current) {
      const highlightedEl = listRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, open]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  let optionIndex = 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between",
          "rounded-lg px-4 py-2",
          "bg-cream-100 text-foreground",
          "border border-border",
          "text-sm text-left",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "focus:border-primary focus:bg-cream-50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-ring ring-offset-1 border-primary bg-cream-50"
        )}
      >
        <span className={cn(!selectedOption && "text-muted-foreground")}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full",
            "rounded-lg bg-card",
            "border border-border/50 shadow-lifted",
            "overflow-hidden"
          )}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full h-9 pl-9 pr-8 rounded-md",
                  "bg-cream-50 text-foreground",
                  "border border-border/50",
                  "text-sm placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : flatOptions.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                {allowCustom && query.trim() && (
                  <button
                    type="button"
                    onClick={handleCustomValue}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Use &quot;{query.trim()}&quot;
                  </button>
                )}
              </div>
            ) : (
              <div className="p-1">
                {Array.from(groupedOptions.entries()).map(
                  ([group, groupOptions]) => (
                    <div key={group || "ungrouped"}>
                      {group && (
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          {group}
                        </div>
                      )}
                      {groupOptions.map((opt) => {
                        const currentIndex = optionIndex++;
                        const isHighlighted = currentIndex === highlightedIndex;
                        const isSelected = opt.value === value;

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            data-index={currentIndex}
                            onClick={() => handleSelect(opt.value)}
                            onMouseEnter={() => setHighlightedIndex(currentIndex)}
                            className={cn(
                              "relative flex w-full cursor-pointer select-none items-center",
                              "rounded-lg py-2.5 pl-10 pr-4",
                              "text-sm text-left",
                              "outline-none",
                              "transition-colors",
                              isHighlighted && "bg-sage-100",
                              !isHighlighted && "hover:bg-sage-50"
                            )}
                          >
                            {isSelected && (
                              <span className="absolute left-3 flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary" />
                              </span>
                            )}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {opt.icon}
                              <div className="flex-1 min-w-0">
                                <span className="block truncate">{opt.label}</span>
                                {opt.description && (
                                  <span className="block text-xs text-muted-foreground truncate">
                                    {opt.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
