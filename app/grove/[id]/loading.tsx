import { Header } from "@/components/shared/header";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for grove page.
 * Shown while the page is loading via React Suspense.
 */
export default function GroveLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack />
      <main className="container mx-auto px-4 py-8">
        {/* Grove header skeleton */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>

        {/* Plant grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
