"use client";

import { useActivities } from "@/hooks/use-activities";
import {
  formatActivityTime,
  getActivityEmoji,
  type Activity,
} from "@/lib/utils/activities";
import { cn } from "@/lib/utils";
import { History, Droplet, Leaf, Pencil, LogOut, Home, Settings } from "lucide-react";

/**
 * Grove Changelog Component
 * Displays a timeline of activities in the grove.
 */
interface GroveChangelogProps {
  groveId: string;
  className?: string;
  maxItems?: number;
}

export function GroveChangelog({
  groveId,
  className,
  maxItems = 10,
}: GroveChangelogProps) {
  const { activities, isLoading } = useActivities(groveId);

  const displayedActivities = activities.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className={cn("animate-pulse space-y-3", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cream-200" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-cream-200 rounded w-3/4" />
              <div className="h-3 bg-cream-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayedActivities.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 text-center",
          className
        )}
      >
        <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center mb-3">
          <History className="w-6 h-6 text-terracotta-400" />
        </div>
        <p className="text-muted-foreground text-sm">
          No activity yet. Start by adding some plants!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {displayedActivities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === displayedActivities.length - 1}
        />
      ))}
    </div>
  );
}

/**
 * Individual activity item in the changelog.
 */
interface ActivityItemProps {
  activity: Activity;
  isLast?: boolean;
}

function ActivityItem({ activity, isLast }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 group">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0",
            getActivityColor(activity.type)
          )}
        >
          <ActivityIcon type={activity.type} />
        </div>
        {!isLast && (
          <div className="w-0.5 h-full min-h-[24px] bg-cream-200 mt-1" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <p className="text-sm text-foreground leading-tight">
          {activity.message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatActivityTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

/**
 * Icon component for activity types - avoids dynamic component creation during render.
 */
function ActivityIcon({ type }: { type: Activity["type"] }) {
  const className = "w-4 h-4";
  switch (type) {
    case "plant_added":
      return <Leaf className={className} />;
    case "plant_watered":
      return <Droplet className={className} />;
    case "plant_edited":
      return <Pencil className={className} />;
    case "plant_removed":
      return <LogOut className={className} />;
    case "grove_created":
      return <Home className={className} />;
    case "grove_updated":
      return <Settings className={className} />;
    default:
      return <History className={className} />;
  }
}

/**
 * Get the color scheme for an activity type.
 */
function getActivityColor(type: Activity["type"]): string {
  switch (type) {
    case "plant_added":
      return "bg-terracotta-100 text-terracotta-600";
    case "plant_watered":
      return "bg-water-500/20 text-water-600";
    case "plant_edited":
      return "bg-clay-400/20 text-clay-500";
    case "plant_removed":
      return "bg-cream-200 text-terracotta-400";
    case "grove_created":
      return "bg-terracotta-200 text-terracotta-700";
    case "grove_updated":
      return "bg-cream-200 text-terracotta-500";
    default:
      return "bg-cream-200 text-terracotta-500";
  }
}

/**
 * Compact changelog widget for the grove page sidebar.
 */
interface ChangelogWidgetProps {
  groveId: string;
  className?: string;
}

export function ChangelogWidget({ groveId, className }: ChangelogWidgetProps) {
  const { activities, isLoading } = useActivities(groveId);

  const recentActivities = activities.slice(0, 5);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-cream-200 p-4 shadow-soft",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-terracotta-500" />
        <h3 className="font-medium text-foreground">Recent Activity</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-cream-100 rounded" />
          ))}
        </div>
      ) : recentActivities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No activity yet
        </p>
      ) : (
        <div className="space-y-2">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-base" role="img" aria-label={activity.type}>
                {getActivityEmoji(activity.type)}
              </span>
              <span className="flex-1 text-muted-foreground truncate">
                {activity.message}
              </span>
              <span className="text-xs text-muted-foreground/60 flex-shrink-0">
                {formatActivityTime(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
