"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { Home, Check, X, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grove } from "@/types/supabase";

interface GoogleHomeLinkStatusProps {
  grove: Grove;
}

interface GoogleHomeLink {
  linked_groves: string[];
}

/**
 * Shows Google Home connection status for a grove.
 * Allows linking/unlinking from grove settings.
 */
export function GoogleHomeLinkStatus({ grove }: GoogleHomeLinkStatusProps) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [link, setLink] = useState<GoogleHomeLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const isGroveLinked = link?.linked_groves?.includes(grove.id);

  // Fetch current link status
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchLink = async () => {
      try {
        const response = await fetch("/api/google-home/status");
        if (response.ok) {
          const data = await response.json();
          setLink(data.link);
        }
      } catch (error) {
        console.error("Failed to fetch Google Home status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, [isAuthenticated]);

  // Handle unlinking this grove
  const handleUnlinkGrove = async () => {
    if (!link) return;

    setIsUnlinking(true);
    try {
      const newGroves = link.linked_groves.filter((id) => id !== grove.id);

      const response = await fetch("/api/google-home/update-groves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groveIds: newGroves }),
      });

      if (response.ok) {
        setLink({ ...link, linked_groves: newGroves });
        showToast("Grove disconnected from Google Home", "success");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Failed to unlink grove:", error);
      showToast("Failed to disconnect grove", "error");
    } finally {
      setIsUnlinking(false);
    }
  };

  // Handle linking this grove
  const handleLinkGrove = async () => {
    if (!link) return;

    setIsUnlinking(true);
    try {
      const newGroves = [...link.linked_groves, grove.id];

      const response = await fetch("/api/google-home/update-groves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groveIds: newGroves }),
      });

      if (response.ok) {
        setLink({ ...link, linked_groves: newGroves });
        showToast("Grove connected to Google Home", "success");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Failed to link grove:", error);
      showToast("Failed to connect grove", "error");
    } finally {
      setIsUnlinking(false);
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking Google Home...</span>
      </div>
    );
  }

  // Not linked to Google Home yet
  if (!link) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Home className="w-4 h-4" />
          <span className="text-sm">Not connected to Google Home</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Connect your Plangrove account to Google Home to control your plants
          with voice commands. Set up linking in the Google Home app.
        </p>
        <a
          href="https://home.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-terracotta-600 hover:text-terracotta-700"
        >
          Open Google Home
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // Linked - show grove status
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isGroveLinked ? "bg-green-100" : "bg-muted"
          )}
        >
          <Home
            className={cn(
              "w-4 h-4",
              isGroveLinked ? "text-green-600" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Google Home
            </span>
            {isGroveLinked ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Not connected
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isGroveLinked
              ? "Plants in this grove appear in Google Home"
              : "This grove is not connected to Google Home"}
          </p>
        </div>
      </div>

      {isGroveLinked ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleUnlinkGrove}
          disabled={isUnlinking}
          className="gap-2"
        >
          {isUnlinking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
          Disconnect Grove
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLinkGrove}
          disabled={isUnlinking}
          className="gap-2"
        >
          {isUnlinking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Home className="w-4 h-4" />
          )}
          Connect Grove
        </Button>
      )}
    </div>
  );
}
