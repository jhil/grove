"use client";

import { useOnboarding } from "@/hooks/use-onboarding";
import { useMyGroves } from "@/hooks/use-my-groves";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { MyGroves } from "@/components/grove/my-groves";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/auth-dialog";
import {
  Leaf,
  Users,
  Droplets,
  Link as LinkIcon,
  ArrowRight,
  Building2,
  Home,
  Trees,
} from "lucide-react";
import { transition } from "@/lib/motion";

/**
 * Home page with editorial, full-width layout.
 * Inspired by: Samara, Nornorm, Spring/Summer
 */
export function HomeContent() {
  const { hasCompletedOnboarding, isLoaded, completeOnboarding } = useOnboarding();
  const { hasGroves } = useMyGroves();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition.enter}
        >
          <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-sage-600" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="py-6 px-6">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition.enter}
          >
            <div className="w-7 h-7 rounded-lg bg-sage-100 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-sage-600" />
            </div>
            <span className="font-medium text-foreground tracking-tight">Plangrove</span>
          </motion.div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <OnboardingFlow onComplete={completeOnboarding} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - minimal, full width */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm" aria-label="Main navigation">
        <div className="flex items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-sage-100 flex items-center justify-center transition-colors group-hover:bg-sage-200">
              <Leaf className="w-3.5 h-3.5 text-sage-600" />
            </div>
            <span className="font-medium text-foreground tracking-tight">Plangrove</span>
          </Link>
          <AuthButton />
        </div>
      </nav>

      {/* Hero - Split layout with image */}
      <HeroSection />

      {/* User's Groves */}
      {hasGroves && (
        <motion.section
          className="px-6 lg:px-12 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.enter, delay: 0.5 }}
        >
          <MyGroves />
        </motion.section>
      )}

      {/* Full-width lifestyle image */}
      <LifestyleImageSection />

      {/* Features - with imagery */}
      <FeaturesSection />

      {/* Use Cases - alternating image layouts */}
      <UseCasesSection />

      {/* CTA - with background image */}
      <CTASection />

      {/* Footer - minimal */}
      <footer className="px-6 lg:px-12 py-12 border-t border-border/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sage-100 flex items-center justify-center">
              <Leaf className="w-3 h-3 text-sage-600" />
            </div>
            <span className="text-sm text-muted-foreground">Plangrove</span>
          </div>
          <Link
            href="/colophon"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Colophon
          </Link>
        </div>
      </footer>
    </div>
  );
}

function HeroSection() {
  return (
    <header id="main-content" className="min-h-screen lg:min-h-[90vh] pt-20">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-5rem)] lg:min-h-[calc(90vh-5rem)]">
        {/* Text content */}
        <div className="flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-20 order-2 lg:order-1">
          <motion.p
            className="text-sm text-muted-foreground mb-4 tracking-wide uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.enter, delay: 0.1 }}
          >
            Collaborative plant care
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight leading-[0.95] max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.slow, delay: 0.15 }}
          >
            Share the joy of
            <br />
            <span className="text-sage-500">growing together</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground mt-6 sm:mt-8 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition.enter, delay: 0.3 }}
          >
            Coordinate plant care with your team, roommates, or community.
            No more forgotten waterings.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.enter, delay: 0.4 }}
          >
            <Link href="/create-grove">
              <Button size="lg" className="group w-full sm:w-auto">
                Create a grove
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground text-center sm:text-left">
              Free &middot; No account needed
            </span>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          className="relative h-[50vh] lg:h-auto order-1 lg:order-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.slow, delay: 0.2 }}
        >
          <Image
            src="/img/plant-room.jpg"
            alt="A sunlit room filled with lush green plants and cozy furniture"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-background/10 lg:via-transparent lg:to-transparent" />
        </motion.div>
      </div>
    </header>
  );
}

function LifestyleImageSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-4 sm:py-8">
      <motion.div
        className="px-4 sm:px-6 lg:px-12"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={transition.slow}
      >
        <div className="relative aspect-[21/9] sm:aspect-[3/1] overflow-hidden rounded-2xl sm:rounded-3xl">
          <Image
            src="/img/foliage-closeup.jpg"
            alt="Closeup of vibrant green foliage in a garden"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: LinkIcon,
      title: "Share with a link",
      description: "Create a grove and share the link. Anyone can join without creating an account.",
    },
    {
      icon: Users,
      title: "Collaborate",
      description: "Everyone sees the same plants and their watering status in real time.",
    },
    {
      icon: Droplets,
      title: "Track watering",
      description: "See when plants need water. Mark them as watered with a single tap.",
    },
    {
      icon: Leaf,
      title: "Keep plants healthy",
      description: "Smart schedules help you never miss a watering again.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="features-heading"
      className="py-20 sm:py-28 lg:py-36"
    >
      <div className="px-6 lg:px-12">
        <motion.div
          className="mb-12 sm:mb-20 max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={transition.enter}
        >
          <p className="text-sm text-muted-foreground mb-3 tracking-wide uppercase">
            How it works
          </p>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight"
          >
            Simple plant care
            <br />
            for groups
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition.enter, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600 mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
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
      icon: Building2,
      label: "Office",
      title: "Keep office plants thriving",
      description: "Share responsibility for office greenery across your team. Never let the conference room ficus down again.",
      image: "/img/kitchen-counter.jpg",
      imageAlt: "A kitchen counter with a potted plant adding life to the space",
    },
    {
      icon: Home,
      label: "Home",
      title: "Roommate coordination",
      description: "Never argue about who watered the fiddle leaf fig. Everyone can see the status and log their care.",
      image: "/img/reading-plants.jpg",
      imageAlt: "A person reading a book surrounded by lush green plants",
    },
    {
      icon: Trees,
      label: "Community",
      title: "Garden collaboration",
      description: "Coordinate care across multiple caretakers and spaces. Perfect for community gardens and shared courtyards.",
      image: "/img/kitchen-shelves.jpg",
      imageAlt: "Kitchen shelves filled with a variety of healthy plants",
    },
  ];

  return (
    <section ref={ref} aria-label="Use cases" className="py-8 sm:py-12">
      {useCases.map((useCase, index) => (
        <motion.div
          key={useCase.title}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...transition.slow, delay: index * 0.15 }}
          className="mb-8 sm:mb-12 last:mb-0"
        >
          <div
            className={`grid lg:grid-cols-2 gap-0 ${
              index % 2 === 1 ? "lg:direction-rtl" : ""
            }`}
          >
            {/* Image - alternating sides on desktop */}
            <div
              className={`relative h-[40vh] sm:h-[50vh] lg:h-[70vh] ${
                index % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              <Image
                src={useCase.image}
                alt={useCase.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div
              className={`flex flex-col justify-center p-8 sm:p-12 lg:p-20 bg-sage-50/50 ${
                index % 2 === 1 ? "lg:order-1" : ""
              }`}
            >
              <div className="max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center text-sage-600">
                    <useCase.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-muted-foreground tracking-wide uppercase">
                    {useCase.label}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-4 tracking-tight">
                  {useCase.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} aria-labelledby="cta-heading" className="relative py-24 lg:py-40">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-sage-50/30" />

      <div className="relative px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={transition.enter}
          >
            <h2
              id="cta-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight mb-6"
            >
              Ready to grow
              <br />
              together?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
              Create your first grove in seconds. Start caring for plants as a team.
            </p>
            <Link href="/create-grove">
              <Button size="lg" variant="accent" className="group">
                Start your grove
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
