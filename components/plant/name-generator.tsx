"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateNameSuggestions } from "@/lib/utils/plant-names";
import { cn } from "@/lib/utils";
import { Sparkles, RefreshCw } from "lucide-react";

/**
 * Plant name generator component with suggestions.
 */
interface NameGeneratorProps {
  plantType: string;
  onSelect: (name: string) => void;
  className?: string;
}

export function NameGenerator({ plantType, onSelect, className }: NameGeneratorProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const generateSuggestions = () => {
    const names = generateNameSuggestions(plantType, 5);
    setSuggestions(names);
    setIsOpen(true);
  };

  const refreshSuggestions = () => {
    const names = generateNameSuggestions(plantType, 5);
    setSuggestions(names);
  };

  const handleSelect = (name: string) => {
    onSelect(name);
    setIsOpen(false);
    setSuggestions([]);
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={generateSuggestions}
        className={cn("gap-1.5 text-sage-500 hover:text-sage-600", className)}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Suggest names
      </Button>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Name suggestions
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={refreshSuggestions}
            className="h-6 w-6"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 text-xs"
          >
            Close
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((name, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSelect(name)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full",
              "bg-sage-50 text-sage-700 hover:bg-sage-100",
              "transition-colors"
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
