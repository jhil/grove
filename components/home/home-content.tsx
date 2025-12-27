"use client";

import { useOnboarding } from "@/hooks/use-onboarding";
import { useMyGroves } from "@/hooks/use-my-groves";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { MyGroves } from "@/components/grove/my-groves";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Droplets, Share2 } from "lucide-react";

/**
 * Home page content with onboarding for new users.
 */
export function HomeContent() {
  const { hasCompletedOnboarding, isLoaded, completeOnboarding } = useOnboarding();
  const { hasGroves } = useMyGroves();

  // Show nothing while loading to prevent flash
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show onboarding for new users
  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-sage-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta-300 rounded-full blur-3xl opacity-20" />
        </div>

        {/* Header */}
        <header className="py-8">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-sage-600" />
              </div>
              <span className="font-semibold text-lg text-foreground">Plangrove</span>
            </div>
          </div>
        </header>

        {/* Onboarding content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <OnboardingFlow onComplete={completeOnboarding} />
        </main>
      </div>
    );
  }

  // Regular home page for returning users
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-sage-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta-300 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-100 mb-8">
              <Leaf className="w-10 h-10 text-sage-600" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Care for plants,{" "}
              <span className="text-primary">together</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Plangrove makes it easy to share plant care with your team,
              roommates, or community. No more forgotten waterings or
              wilted leaves.
            </p>

            <Link href="/create-grove">
              <Button size="lg" className="text-lg px-8">
                Create Your Grove
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground mt-4">
              Free to use. Sign in to track who cares for your plants.
            </p>
          </div>
        </div>
      </header>

      {/* User's Groves - shown if they have any saved */}
      {hasGroves && <MyGroves />}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Simple plant care for groups
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to keep your plants happy, together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Share2 className="w-6 h-6" />}
              title="Share with a link"
              description="Create a grove and share the link. Anyone can join - no accounts needed."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Collaborate"
              description="Everyone sees the same plants. Water one, and everyone knows."
            />
            <FeatureCard
              icon={<Droplets className="w-6 h-6" />}
              title="Track watering"
              description="See when plants need water and mark them as watered with one tap."
            />
            <FeatureCard
              icon={<Leaf className="w-6 h-6" />}
              title="Keep plants happy"
              description="Smart reminders help you never forget a watering again."
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Perfect for...
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <UseCaseCard
              emoji="🏢"
              title="Office Plants"
              description="Share the responsibility of caring for office greenery."
            />
            <UseCaseCard
              emoji="🏠"
              title="Roommates"
              description="Never argue about who watered the fiddle leaf fig."
            />
            <UseCaseCard
              emoji="🌱"
              title="Community Gardens"
              description="Coordinate plant care across multiple caretakers."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to grow together?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your first grove in seconds.
          </p>
          <Link href="/create-grove">
            <Button size="lg" variant="accent" className="text-lg px-8">
              Start Your Grove
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Made with 🌱 for plant lovers everywhere</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card variant="elevated" className="p-6">
      <CardContent className="p-0">
        <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600 mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function UseCaseCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
