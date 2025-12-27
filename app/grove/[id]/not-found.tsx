import Link from "next/link";
import { Header } from "@/components/shared/header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * 404 page for grove routes.
 * Shown when a grove is not found.
 */
export default function GroveNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack />
      <main className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<AlertCircle className="w-8 h-8" />}
          title="Grove not found"
          description="This grove may have been deleted or the link is incorrect."
          action={
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          }
        />
      </main>
    </div>
  );
}
