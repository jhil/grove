"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
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
import { useToast } from "@/components/ui/toast";
import { Plus, Leaf, AlertCircle } from "lucide-react";
import { useState } from "react";

/**
 * Grove detail page.
 * Shows all plants in a grove with ability to add/edit/water plants.
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

  // Enable real-time sync for this grove
  useRealtimeSync(id);

  // Save grove to user's list when loaded
  const { saveGrove, updateGroveName } = useMyGroves();
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
        <Header showBack />
        <main className="container mx-auto px-4 py-8">
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
        <Header showBack />
        <main className="container mx-auto px-4 py-16">
          <EmptyState
            icon={<AlertCircle className="w-8 h-8" />}
            title="Grove not found"
            description="This grove may have been deleted or the link is incorrect."
            action={
              <Button onClick={() => router.push("/")}>Go Home</Button>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        showBack
        backHref="/"
        backLabel="Home"
        title={grove.name}
        actions={
          <Button onClick={() => setShowAddPlant(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Plant</span>
          </Button>
        }
      />

      <main className="container mx-auto px-4 py-8">
        {/* Grove Header with name and share functionality */}
        <GroveHeader grove={grove} />

        {/* Quick Actions */}
        {plants && plants.length > 0 && (
          <div className="mt-6">
            <QuickWater plants={plants} groveId={id} />
          </div>
        )}

        {/* Plants Section */}
        <section className="mt-8">
          {/* View Mode & Sort Selectors */}
          {plants && plants.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-foreground">
                Your Plants
                <span className="ml-2 text-sm text-muted-foreground font-normal">
                  ({plants.length})
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <SortSelector groveId={id} />
                <ViewModeSelector groveId={id} />
              </div>
            </div>
          )}

          {plantsLoading ? (
            <PlantGridSkeleton />
          ) : plants && plants.length > 0 ? (
            <PlantViews
              plants={plants}
              groveId={id}
              viewMode={viewMode}
              sortOption={sortOption}
              onPlantWatered={(plant) => logPlantWatered(plant.name, plant.id)}
              onPlantEdited={(plant) => logPlantEdited(plant.name, plant.id)}
              onPlantDeleted={(plant) => logPlantRemoved(plant.name, plant.id)}
            />
          ) : (
            <EmptyState
              icon={<Leaf className="w-8 h-8" />}
              title="No plants yet"
              description="Add your first plant to start tracking its care."
              action={
                <Button onClick={() => setShowAddPlant(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Plant
                </Button>
              }
            />
          )}
        </section>

        {/* Analytics Section */}
        {plants && plants.length > 0 && (
          <section className="mt-8">
            <GroveAnalyticsDashboard groveId={id} plants={plants} />
          </section>
        )}

        {/* Activity & Tips Section */}
        {plants && plants.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChangelogWidget groveId={id} />
            <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft">
              <PlantCareTip />
            </div>
          </div>
        )}
      </main>

      {/* Add Plant Dialog */}
      <PlantForm
        groveId={id}
        open={showAddPlant}
        onOpenChange={setShowAddPlant}
        onSuccess={() => {
          setShowAddPlant(false);
          showToast("Plant added!", "success");
        }}
        onPlantCreated={(plant) => {
          logPlantAdded(plant.name, plant.id, plant.type);
        }}
      />
    </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
