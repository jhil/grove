"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bell, BellOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications, plantNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Notification settings card for profile page
 */
export function NotificationSettings() {
  const { isSupported, permission, requestPermission, showNotification } = useNotifications();
  const { showToast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        showToast("Notifications enabled!", "success");
        // Send test notification
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
      showToast("Test notification sent!", "success");
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-cream-200 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5" />
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

  return (
    <Card className="border-cream-200 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notification Permission</p>
            <p className="text-xs text-muted-foreground">
              {permission === "granted"
                ? "Enabled - you'll receive reminders"
                : permission === "denied"
                  ? "Blocked - enable in browser settings"
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
          >
            {isRequesting ? (
              "Requesting..."
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </>
            )}
          </Button>
        )}

        {/* Test Button */}
        {permission === "granted" && (
          <Button
            onClick={handleTestNotification}
            variant="secondary"
            className="w-full"
          >
            Send Test Notification
          </Button>
        )}

        {/* Denied Message */}
        {permission === "denied" && (
          <div className="p-3 bg-terracotta-400/10 rounded-lg">
            <p className="text-sm text-terracotta-600">
              Notifications are blocked. To enable them, click the lock icon in your browser&apos;s
              address bar and allow notifications for this site.
            </p>
          </div>
        )}

        {/* Notification Types */}
        {permission === "granted" && (
          <div className="pt-2 space-y-2">
            <p className="text-sm font-medium">You&apos;ll receive reminders for:</p>
            <NotificationTypeItem
              icon="💧"
              title="Watering reminders"
              description="When plants need water"
            />
            <NotificationTypeItem
              icon="🌱"
              title="Streak milestones"
              description="When you reach care streaks"
            />
            <NotificationTypeItem
              icon="🎂"
              title="Plant birthdays"
              description="Annual celebrations"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PermissionBadge({ permission }: { permission: string }) {
  const configs = {
    granted: { bg: "bg-sage-100", text: "text-sage-600", icon: Check, label: "Enabled" },
    denied: { bg: "bg-terracotta-100", text: "text-terracotta-600", icon: X, label: "Blocked" },
    default: { bg: "bg-cream-100", text: "text-muted-foreground", icon: Bell, label: "Off" },
  };
  const config = configs[permission as keyof typeof configs] || configs.default;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </motion.div>
  );
}

function NotificationTypeItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-cream-50">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
