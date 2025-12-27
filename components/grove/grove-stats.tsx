"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getWateringStatus } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import { Droplets, Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import type { Plant } from "@/types/supabase";

/**
 * Statistics dashboard for a grove.
 * Shows summary of plant health and care status.
 */
interface GroveStatsProps {
  plants: Plant[];
}

export function GroveStats({ plants }: GroveStatsProps) {
  // Calculate statistics
  const totalPlants = plants.length;

  const stats = plants.reduce(
    (acc, plant) => {
      const status = getWateringStatus(
        plant.last_watered,
        plant.watering_interval
      );
      if (status === "overdue") acc.overdue++;
      else if (status === "due-today") acc.dueToday++;
      else if (status === "upcoming") acc.upcoming++;
      else acc.healthy++;
      return acc;
    },
    { overdue: 0, dueToday: 0, upcoming: 0, healthy: 0 }
  );

  const needsAttention = stats.overdue + stats.dueToday;

  // Don't render if no plants
  if (totalPlants === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Leaf className="w-5 h-5" />}
        label="Total Plants"
        value={totalPlants}
        variant="default"
      />
      <StatCard
        icon={<AlertTriangle className="w-5 h-5" />}
        label="Need Water"
        value={needsAttention}
        variant={needsAttention > 0 ? "warning" : "default"}
        subtitle={needsAttention > 0 ? "Action needed" : "All good"}
      />
      <StatCard
        icon={<Droplets className="w-5 h-5" />}
        label="Due Today"
        value={stats.dueToday}
        variant={stats.dueToday > 0 ? "accent" : "default"}
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5" />}
        label="Healthy"
        value={stats.healthy}
        variant={stats.healthy === totalPlants ? "success" : "default"}
        subtitle={
          stats.healthy === totalPlants ? "Great job!" : undefined
        }
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant?: "default" | "warning" | "accent" | "success";
  subtitle?: string;
}

function StatCard({
  icon,
  label,
  value,
  variant = "default",
  subtitle,
}: StatCardProps) {
  const variantStyles = {
    default: {
      bg: "bg-sage-50",
      icon: "text-sage-500",
      value: "text-sage-700",
    },
    warning: {
      bg: "bg-terracotta-400/10",
      icon: "text-terracotta-500",
      value: "text-terracotta-600",
    },
    accent: {
      bg: "bg-water-400/10",
      icon: "text-water-500",
      value: "text-water-600",
    },
    success: {
      bg: "bg-sage-100",
      icon: "text-sage-600",
      value: "text-sage-700",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className="border-0 shadow-none">
      <CardContent className={cn("p-4 rounded-xl", styles.bg)}>
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5", styles.icon)}>{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn("text-2xl font-bold", styles.value)}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * A more compact care summary for the top of the page.
 */
interface CareSummaryProps {
  plants: Plant[];
}

export function CareSummary({ plants }: CareSummaryProps) {
  if (plants.length === 0) return null;

  const needsWater = plants.filter((p) => {
    const status = getWateringStatus(p.last_watered, p.watering_interval);
    return status === "overdue" || status === "due-today";
  });

  const allHealthy = needsWater.length === 0;

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-xl flex items-center gap-3",
        allHealthy ? "bg-sage-100" : "bg-terracotta-400/10"
      )}
    >
      {allHealthy ? (
        <>
          <CheckCircle className="w-5 h-5 text-sage-600" />
          <div>
            <p className="text-sm font-medium text-sage-700">
              All plants are happy!
            </p>
            <p className="text-xs text-sage-600">
              No plants need watering right now
            </p>
          </div>
        </>
      ) : (
        <>
          <Droplets className="w-5 h-5 text-terracotta-500" />
          <div>
            <p className="text-sm font-medium text-terracotta-600">
              {needsWater.length} plant{needsWater.length !== 1 ? "s" : ""} need
              water
            </p>
            <p className="text-xs text-terracotta-500">
              {needsWater.map((p) => p.name).slice(0, 3).join(", ")}
              {needsWater.length > 3 && ` +${needsWater.length - 3} more`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
