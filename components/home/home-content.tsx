"use client";

import { useOnboarding } from "@/hooks/use-onboarding";
import { useMyGroves } from "@/hooks/use-my-groves";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { MyGroves } from "@/components/grove/my-groves";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Droplets, Share2, ArrowRight, Sparkles } from "lucide-react";

/**
 * Home page content with onboarding for new users.
 * Features delightful animations and organic design.
 */
export function HomeContent() {
  const { hasCompletedOnboarding, isLoaded, completeOnboarding } = useOnboarding();
  const { hasGroves } = useMyGroves();

  // Show nothing while loading to prevent flash
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Leaf className="w-5 h-5 text-sage-600" />
          </motion.div>
          <span className="text-muted-foreground">Loading...</span>
        </motion.div>
      </div>
    );
  }

  // Show onboarding for new users
  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-sage-200 rounded-full blur-3xl opacity-40"
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta-300 rounded-full blur-3xl opacity-20"
            animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        {/* Header */}
        <header className="py-8">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <motion.div
              className="flex items-center gap-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-sage-600" />
              </div>
              <span className="font-semibold text-lg text-foreground">Plangrove</span>
            </motion.div>
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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Organic texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjEwIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')]" />

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-sage-200 rounded-full blur-3xl opacity-40"
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta-300 rounded-full blur-3xl opacity-20"
            animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sage-100 rounded-full blur-3xl opacity-30"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Animated logo */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-100 mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Leaf className="w-10 h-10 text-sage-600" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Care for plants,{" "}
              <motion.span
                className="text-primary inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                together
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Plangrove makes it easy to share plant care with your team,
              roommates, or community. No more forgotten waterings or
              wilted leaves.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href="/create-grove">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="text-lg px-8 gap-2 group">
                    Create Your Grove
                    <motion.span
                      className="inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Free to use. Sign in to track who cares for your plants.
            </motion.p>
          </div>
        </div>
      </header>

      {/* User's Groves - shown if they have any saved */}
      {hasGroves && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MyGroves />
        </motion.div>
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Use Cases */}
      <UseCasesSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Made with 🌱 for plant lovers everywhere
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Simple plant care for groups
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to keep your plants happy, together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <Share2 className="w-6 h-6" />,
              title: "Share with a link",
              description: "Create a grove and share the link. Anyone can join - no accounts needed.",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Collaborate",
              description: "Everyone sees the same plants. Water one, and everyone knows.",
            },
            {
              icon: <Droplets className="w-6 h-6" />,
              title: "Track watering",
              description: "See when plants need water and mark them as watered with one tap.",
            },
            {
              icon: <Leaf className="w-6 h-6" />,
              title: "Keep plants happy",
              description: "Smart reminders help you never forget a watering again.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const useCases = [
    {
      emoji: "🏢",
      title: "Office Plants",
      description: "Share the responsibility of caring for office greenery.",
    },
    {
      emoji: "🏠",
      title: "Roommates",
      description: "Never argue about who watered the fiddle leaf fig.",
    },
    {
      emoji: "🌱",
      title: "Community Gardens",
      description: "Coordinate plant care across multiple caretakers.",
    },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-cream-100 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-sage-200 rounded-full blur-3xl opacity-30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Perfect for...
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.15, duration: 0.4, type: "spring" }}
            >
              <UseCaseCard {...useCase} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-24 relative">
      {/* Animated sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-sage-300"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Ready to grow together?
        </motion.h2>
        <motion.p
          className="text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Create your first grove in seconds.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link href="/create-grove">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="accent" className="text-lg px-8 gap-2">
                Start Your Grove
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
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
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card variant="elevated" className="p-6 h-full">
        <CardContent className="p-0">
          <motion.div
            className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600 mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
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
    <motion.div
      className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm"
      whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.8)" }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="text-4xl mb-4"
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.3 }}
      >
        {emoji}
      </motion.div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
