"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Share2, Check } from "lucide-react";
import { WeatherIndicator } from "@/components/grove/weather-widget";
import { GroveSettingsButton } from "@/components/grove/grove-settings";
import type { Grove } from "@/types/supabase";

/**
 * Header component for a grove.
 * Shows grove name and share functionality.
 */
interface GroveHeaderProps {
  grove: Grove;
}

export function GroveHeader({ grove }: GroveHeaderProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/grove/${grove.id}`;

    try {
      // Try native share first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: grove.name,
          text: `Check out our plant grove: ${grove.name}`,
          url,
        });
        return;
      }

      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Link copied to clipboard!", "success");

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // User cancelled share or clipboard failed
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display">
            {grove.name}
          </h1>
          <WeatherIndicator />
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Share this grove with your team to care for plants together.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={handleShare}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-terracotta-600" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Share Grove
            </>
          )}
        </Button>
        <GroveSettingsButton grove={grove} />
      </div>
    </div>
  );
}
