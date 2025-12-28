"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Target,
  Trophy,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getWateringHistory,
  getGroveAnalytics,
  getWeeklySummary,
  type DailyWateringStats,
  type GroveAnalytics,
} from "@/lib/database/analytics";
import { cn } from "@/lib/utils";
import type { Plant } from "@/types/supabase";

interface GroveAnalyticsDashboardProps {
  groveId: string;
  plants: Plant[];
}

/**
 * Grove Analytics Dashboard - shows care patterns and statistics over time
 */
export function GroveAnalyticsDashboard({
  groveId,
  plants,
}: GroveAnalyticsDashboardProps) {
  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["grove-analytics", groveId],
    queryFn: () => getGroveAnalytics(groveId, plants),
    enabled: plants.length > 0,
  });

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ["watering-history", groveId],
    queryFn: () => getWateringHistory(groveId, 14),
    enabled: plants.length > 0,
  });

  const { data: weekly = [], isLoading: weeklyLoading } = useQuery({
    queryKey: ["weekly-summary", groveId],
    queryFn: () => getWeeklySummary(groveId),
    enabled: plants.length > 0,
  });

  if (plants.length === 0) return null;

  const isLoading = analyticsLoading || historyLoading || weeklyLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 bg-cream-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-cream-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-terracotta-600" />
        <h3 className="text-lg font-medium text-foreground">Grove Analytics</h3>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Droplets className="w-5 h-5" />}
            label="Total Waterings"
            value={analytics.totalWaterings}
            variant="water"
          />
          <MetricCard
            icon={<Target className="w-5 h-5" />}
            label="Care Score"
            value={`${analytics.careConsistency}%`}
            subtitle={getCareScoreLabel(analytics.careConsistency)}
            variant={
              analytics.careConsistency >= 80
                ? "success"
                : analytics.careConsistency >= 50
                  ? "warning"
                  : "danger"
            }
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg Streak"
            value={analytics.averageStreak}
            subtitle="days"
            variant="default"
          />
          <MetricCard
            icon={<Trophy className="w-5 h-5" />}
            label="Best Streak"
            value={analytics.bestStreak}
            subtitle="days"
            variant="gold"
          />
        </div>
      )}

      {/* Activity Chart */}
      <Card className="border-cream-200 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Watering Activity (Last 2 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityChart data={history} />
        </CardContent>
      </Card>

      {/* Weekly Comparison */}
      <Card className="border-cream-200 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyBars data={weekly} />
        </CardContent>
      </Card>

      {/* Plant Highlights */}
      {analytics && (analytics.mostCaredPlant || analytics.leastCaredPlant) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.mostCaredPlant && (
            <HighlightCard
              icon={<Heart className="w-4 h-4" />}
              title="Most Cared For"
              value={analytics.mostCaredPlant.name}
              subtitle={`${analytics.mostCaredPlant.waterings} waterings`}
              variant="positive"
            />
          )}
          {analytics.leastCaredPlant && (
            <HighlightCard
              icon={<AlertTriangle className="w-4 h-4" />}
              title="Needs Attention"
              value={analytics.leastCaredPlant.name}
              subtitle={
                analytics.leastCaredPlant.daysSinceWatered === -1
                  ? "Never watered"
                  : `${analytics.leastCaredPlant.daysSinceWatered} days since last water`
              }
              variant="warning"
            />
          )}
        </div>
      )}
    </div>
  );
}

function getCareScoreLabel(score: number): string {
  if (score >= 90) return "Excellent!";
  if (score >= 80) return "Great";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs work";
  return "Critical";
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "water" | "success" | "warning" | "danger" | "gold";
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  variant = "default",
}: MetricCardProps) {
  const variants = {
    default: { bg: "bg-cream-50", icon: "text-terracotta-500", value: "text-terracotta-700" },
    water: { bg: "bg-water-400/10", icon: "text-water-500", value: "text-water-600" },
    success: { bg: "bg-terracotta-100", icon: "text-terracotta-600", value: "text-terracotta-700" },
    warning: { bg: "bg-amber-50", icon: "text-amber-500", value: "text-amber-600" },
    danger: { bg: "bg-terracotta-400/10", icon: "text-terracotta-500", value: "text-terracotta-600" },
    gold: { bg: "bg-amber-50", icon: "text-amber-500", value: "text-amber-600" },
  };

  const styles = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl p-4", styles.bg)}
    >
      <div className={cn("mb-2", styles.icon)}>{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-bold", styles.value)}>{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  );
}

interface ActivityChartProps {
  data: DailyWateringStats[];
}

function ActivityChart({ data }: ActivityChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((day, index) => {
        const height = day.count > 0 ? (day.count / maxCount) * 100 : 4;
        const isToday = index === data.length - 1;

        return (
          <motion.div
            key={day.date}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
            className={cn(
              "flex-1 rounded-t-sm min-h-1 transition-colors",
              day.count > 0
                ? isToday
                  ? "bg-water-500"
                  : "bg-water-300 hover:bg-water-400"
                : "bg-cream-200"
            )}
            title={`${formatDate(day.date)}: ${day.count} watering${day.count !== 1 ? "s" : ""}`}
          />
        );
      })}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

interface WeeklyBarsProps {
  data: { week: number; count: number; label: string }[];
}

function WeeklyBars({ data }: WeeklyBarsProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((week, index) => (
        <div key={week.week} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-24 flex-shrink-0">
            {week.label}
          </span>
          <div className="flex-1 h-6 bg-cream-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(week.count / maxCount) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "h-full rounded-full",
                index === data.length - 1 ? "bg-water-500" : "bg-water-300"
              )}
            />
          </div>
          <span className="text-sm font-medium text-foreground w-8 text-right">
            {week.count}
          </span>
        </div>
      ))}
    </div>
  );
}

interface HighlightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  variant: "positive" | "warning";
}

function HighlightCard({
  icon,
  title,
  value,
  subtitle,
  variant,
}: HighlightCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 flex items-start gap-3",
        variant === "positive" ? "bg-terracotta-50" : "bg-amber-50"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg",
          variant === "positive" ? "bg-terracotta-100 text-terracotta-600" : "bg-amber-100 text-amber-600"
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="font-medium text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

/**
 * Compact analytics preview for grove cards
 */
export function AnalyticsPreview({
  groveId,
  plants,
}: {
  groveId: string;
  plants: Plant[];
}) {
  const { data: analytics } = useQuery({
    queryKey: ["grove-analytics", groveId],
    queryFn: () => getGroveAnalytics(groveId, plants),
    enabled: plants.length > 0,
  });

  if (!analytics || plants.length === 0) return null;

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Droplets className="w-3 h-3" />
        {analytics.totalWaterings}
      </span>
      <span className="flex items-center gap-1">
        <Target className="w-3 h-3" />
        {analytics.careConsistency}%
      </span>
      {analytics.bestStreak > 0 && (
        <span className="flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          {analytics.bestStreak}
        </span>
      )}
    </div>
  );
}
