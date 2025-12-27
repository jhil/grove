"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateGrove } from "@/hooks/use-grove";
import { useToast } from "@/components/ui/toast";
import { Leaf, Sparkles, ArrowRight } from "lucide-react";

/**
 * Page for creating a new grove.
 * Simple form with grove name, generates a shareable URL.
 */
export default function CreateGrovePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createGrove = useCreateGrove();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Please enter a grove name", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const grove = await createGrove.mutateAsync({ name: name.trim() });
      showToast(`${grove.name} created!`, "success");
      router.push(`/grove/${grove.id}`);
    } catch (error) {
      console.error("Failed to create grove:", error);
      showToast("Failed to create grove. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  // Generate preview URL from name
  const previewSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);

  return (
    <div className="min-h-screen bg-background">
      <Header showBack backHref="/" backLabel="Home" />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-100 mb-4">
              <Leaf className="w-8 h-8 text-sage-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-display mb-2">
              Create Your Grove
            </h1>
            <p className="text-muted-foreground">
              A grove is a shared space for managing plants together.
            </p>
          </div>

          {/* Form Card */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Grove Details</CardTitle>
              <CardDescription>
                Choose a name for your grove. You can always change it later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="grove-name"
                    className="text-sm font-medium text-foreground"
                  >
                    Grove Name
                  </label>
                  <Input
                    id="grove-name"
                    type="text"
                    placeholder="e.g., Office Plants, Living Room, Garden Club"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    autoFocus
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    {name.length}/50 characters
                  </p>
                </div>

                {/* URL Preview */}
                {name.trim() && (
                  <div className="p-4 bg-cream-100 rounded-xl border border-sage-200">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Sparkles className="w-4 h-4 text-terracotta-400" />
                      Your grove URL
                    </div>
                    <code className="text-sm font-mono text-sage-700 break-all">
                      plangrove.app/grove/{previewSlug || "..."}
                    </code>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!name.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Grove
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              After creating your grove, you can add plants and share the link
              with your team.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
