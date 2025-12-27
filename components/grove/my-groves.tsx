"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyGroves } from "@/hooks/use-my-groves";
import { Leaf, Plus, X, Clock } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils/dates";

/**
 * Displays the user's saved groves for quick access.
 */
export function MyGroves() {
  const { groves, isLoaded, hasGroves, removeGrove } = useMyGroves();

  if (!isLoaded) {
    return null;
  }

  if (!hasGroves) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Your Groves</h2>
            <Link href="/create-grove">
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New Grove
              </Button>
            </Link>
          </div>

          <div className="grid gap-3">
            {groves.map((grove) => (
              <GroveItem
                key={grove.id}
                id={grove.id}
                name={grove.name}
                lastVisited={grove.lastVisited}
                onRemove={() => removeGrove(grove.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface GroveItemProps {
  id: string;
  name: string;
  lastVisited: string;
  onRemove: () => void;
}

function GroveItem({ id, name, lastVisited, onRemove }: GroveItemProps) {
  const timeAgo = formatDistanceToNow(new Date(lastVisited));

  return (
    <Card className="group hover:shadow-lifted transition-shadow">
      <Link href={`/grove/${id}`}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-sage-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
