"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bell, BellOff, Check, X, Droplets, Sprout, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications, plantNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";

interface NotificationSettingsProps {
  compact?: boolean;
}

/**
 * Notification settings for profile page
 */
export function NotificationSettings({ compact = false }: NotificationSettingsProps) {
  const { isSupported, permission, requestPermission, showNotification } = useNotifications();
  const { showToast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        showToast("Notifications enabled", "success");
        await showNotification("Notifications enabled", {
          body: "You'll now receive plant care reminders.",
        });
      } else {
        showToast("Notifications not allowed", "error");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = async () => {
    const notification = plantNotifications.wateringReminder("Your Monstera");
    const sent = await showNotification(notification.title, {
      body: notification.body,
      tag: notification.tag,
    });
    if (sent) {
      showToast("Test notification sent", "success");
    }
  };

  if (!isSupported) {
    if (compact) {
      return (
        <p className="text-sm text-muted-foreground">
          Notifications are not supported in your browser.
        </p>
      );
    }
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BellOff className="w-4 h-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notifications are not supported in your browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="space-y-4">
      {/* Permission Status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Permission</p>
          <p className="text-xs text-muted-foreground">
            {permission === "granted"
              ? "Enabled"
              : permission === "denied"
                ? "Blocked in browser settings"
                : "Not yet enabled"}
          </p>
        </div>
        <PermissionBadge permission={permission} />
      </div>

      {/* Enable Button */}
      {permission === "default" && (
        <Button
          onClick={handleEnableNotifications}
          disabled={isRequesting}
          className="w-full"
          size={compact ? "sm" : "md"}
        >
          {isRequesting ? "Requesting..." : "Enable Notifications"}
        </Button>
      )}

      {/* Test Button */}
      {permission === "granted" && (
        <Button
          onClick={handleTestNotification}
          variant="secondary"
          className="w-full"
          size={compact ? "sm" : "md"}
        >
          Send Test Notification
        </Button>
      )}

      {/* Denied Message */}
      {permission === "denied" && (
        <div className="p-3 bg-terracotta-50 rounded-lg border border-terracotta-200">
          <p className="text-sm text-terracotta-700">
            Notifications are blocked. To enable them, click the lock icon in your browser&apos;s
            address bar and allow notifications.
          </p>
        </div>
      )}

      {/* Notification Types */}
      {permission === "granted" && !compact && (
        <div className="pt-2 space-y-2">
          <p className="text-sm font-medium">You&apos;ll receive reminders for:</p>
          <NotificationTypeItem
            icon={Droplets}
            title="Watering reminders"
            description="When plants need water"
          />
          <NotificationTypeItem
            icon={Sprout}
            title="Streak milestones"
            description="When you reach care streaks"
          />
          <NotificationTypeItem
            icon={Gift}
            title="Plant birthdays"
            description="Annual celebrations"
          />
        </div>
      )}
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="w-4 h-4" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

function PermissionBadge({ permission }: { permission: string }) {
  const configs: Record<string, { bg: string; text: string; Icon: React.ComponentType<{ className?: string }>; label: string }> = {
    granted: { bg: "bg-terracotta-50", text: "text-terracotta-700", Icon: Check, label: "Enabled" },
    denied: { bg: "bg-terracotta-50", text: "text-terracotta-700", Icon: X, label: "Blocked" },
    default: { bg: "bg-cream-100", text: "text-muted-foreground", Icon: Bell, label: "Off" },
  };

  const config = configs[permission] || configs.default;
  const { Icon } = config;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition.fast}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
        config.bg,
        config.text,
        permission === "granted" && "border-terracotta-200",
        permission === "denied" && "border-terracotta-200",
        permission === "default" && "border-border/50"
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </motion.div>
  );
}

function NotificationTypeItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-terracotta-50/50">
      <div className="w-8 h-8 rounded-md bg-terracotta-100 flex items-center justify-center text-terracotta-600">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
