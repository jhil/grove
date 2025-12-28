"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlantViews } from "@/components/plant/plant-views";
import { PlantForm } from "@/components/plant/plant-form";
import { GroveHeader } from "@/components/grove/grove-header";
import { QuickWater, PlantCareTip } from "@/components/grove/grove-health";
import { ViewModeSelector } from "@/components/grove/view-mode-selector";
import { SortSelector } from "@/components/grove/sort-selector";
import { ChangelogWidget } from "@/components/grove/grove-changelog";
import { GroveAnalyticsDashboard } from "@/components/grove/grove-analytics";
import { useGrove } from "@/hooks/use-grove";
import { usePlants } from "@/hooks/use-plants";
import { useRealtimeSync } from "@/hooks/use-realtime";
import { useActivities } from "@/hooks/use-activities";
import { useViewMode } from "@/hooks/use-view-mode";
import { useSortOption } from "@/hooks/use-sort";
import { useMyGroves } from "@/hooks/use-my-groves";
import { useGroveTheme } from "@/hooks/use-grove-theme";
import { useToast } from "@/components/ui/toast";
import { AuthButton } from "@/components/auth/auth-dialog";
import { Plus, Leaf, AlertCircle, ArrowLeft } from "lucide-react";
import { transition } from "@/lib/motion";

/**
 * Grove detail page with editorial layout.
 */
interface GrovePageProps {
  params: Promise<{ id: string }>;
}

export default function GrovePage({ params }: GrovePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const { data: grove, isLoading: groveLoading, error: groveError } = useGrove(id);
  const { data: plants, isLoading: plantsLoading } = usePlants(id);

  // Apply grove color theme
  useGroveTheme(grove?.color_theme);

  // Enable real-time sync for this grove
  useRealtimeSync(id);

  // Save grove to user's list when loaded
  const { saveGrove } = useMyGroves();
  useEffect(() => {
    if (grove) {
      saveGrove({ id: grove.id, name: grove.name });
    }
  }, [grove, saveGrove]);

  // Activity logging
  const { logPlantAdded, logPlantWatered, logPlantEdited, logPlantRemoved } = useActivities(id);

  // View mode and sort preferences
  const { viewMode } = useViewMode(id);
  const { sortOption } = useSortOption(id);

  const [showAddPlant, setShowAddPlant] = useState(false);

  // Loading state
  if (groveLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="px-6 lg:px-12 py-8">
          <GroveHeaderSkeleton />
          <PlantGridSkeleton />
        </main>
      </div>
    );
  }

  // Error state - grove not found
  if (groveError || !grove) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="px-6 lg:px-12 py-16">
          <EmptyState
            icon={<AlertCircle className="w-6 h-6" />}
            title="Grove not found"
            description="This grove may have been deleted or the link is incorrect."
            action={
              <Button onClick={() => router.push("/")}>Go home</Button>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav groveName={grove.name} onAddPlant={() => setShowAddPlant(true)} />

      <main className="px-6 lg:px-12 py-8">
        {/* Grove Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition.enter}
        >
          <GroveHeader grove={grove} />
        </motion.div>

        {/* Quick Actions */}
        {plants && plants.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.enter, delay: 0.1 }}
          >
            <QuickWater plants={plants} groveId={id} />
          </motion.div>
        )}

        {/* Plants Section */}
        <section className="mt-12">
          {plants && plants.length > 0 && (
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.15 }}
            >
              <div>
                <h2 className="text-xl font-medium text-foreground tracking-tight">
                  Plants
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {plants.length} {plants.length === 1 ? "plant" : "plants"} in this grove
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SortSelector groveId={id} />
                <ViewModeSelector groveId={id} />
              </div>
            </motion.div>
          )}

          {plantsLoading ? (
            <PlantGridSkeleton />
          ) : plants && plants.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.enter, delay: 0.2 }}
            >
              <PlantViews
                plants={plants}
                groveId={id}
                viewMode={viewMode}
                sortOption={sortOption}
                onPlantWatered={(plant) => logPlantWatered(plant.name, plant.id)}
                onPlantEdited={(plant) => logPlantEdited(plant.name, plant.id)}
                onPlantDeleted={(plant) => logPlantRemoved(plant.name, plant.id)}
              />
            </motion.div>
          ) : (
            <EmptyState
              icon={<Leaf className="w-6 h-6" />}
              title="No plants yet"
              description="Add your first plant to start tracking its care."
              action={
                <Button onClick={() => setShowAddPlant(true)}>
                  Add your first plant
                </Button>
              }
            />
          )}
        </section>

        {/* Analytics Section */}
        {plants && plants.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.enter, delay: 0.25 }}
          >
            <GroveAnalyticsDashboard groveId={id} plants={plants} />
          </motion.section>
        )}

        {/* Activity & Tips Section */}
        {plants && plants.length > 0 && (
          <motion.div
            className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.enter, delay: 0.3 }}
          >
            <ChangelogWidget groveId={id} />
            <div className="bg-white rounded-xl border border-border/50 p-6">
              <PlantCareTip />
            </div>
          </motion.div>
        )}
      </main>

      {/* Add Plant Dialog */}
      <PlantForm
        groveId={id}
        open={showAddPlant}
        onOpenChange={setShowAddPlant}
        onSuccess={() => {
          setShowAddPlant(false);
          showToast("Plant added", "success");
        }}
        onPlantCreated={(plant) => {
          logPlantAdded(plant.name, plant.id, plant.type);
        }}
      />
    </div>
  );
}

/**
 * Navigation bar for grove page
 */
function Nav({
  groveName,
  onAddPlant,
}: {
  groveName?: string;
  onAddPlant?: () => void;
}) {
  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30">
      <div className="flex items-center justify-between px-6 lg:px-12 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          {groveName && (
            <>
              <span className="text-border">/</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {groveName}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onAddPlant && (
            <Button onClick={onAddPlant} size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add plant</span>
            </Button>
          )}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}

/**
 * Skeleton for grove header during loading.
 */
function GroveHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-40" />
    </div>
  );
}

/**
 * Skeleton for plant grid during loading.
 */
function PlantGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
