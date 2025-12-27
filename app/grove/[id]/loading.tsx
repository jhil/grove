"use client";

import { motion } from "motion/react";
import { Header } from "@/components/shared/header";
import { GrovePageSkeleton } from "@/components/ui/skeleton";
import { Leaf } from "lucide-react";

/**
 * Loading state for grove page.
 * Shown while the page is loading via React Suspense.
 * Features delightful shimmer animations.
 */
export default function GroveLoading() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Subtle animated background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-20 right-20 w-48 h-48 bg-sage-100 rounded-full blur-3xl opacity-40"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-10 w-64 h-64 bg-cream-200 rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header showBack />

      <main className="container mx-auto px-4 py-8">
        {/* Loading indicator with plant icon */}
        <motion.div
          className="flex items-center gap-2 text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Leaf className="w-4 h-4" />
          </motion.div>
          <span className="text-sm">Loading your grove...</span>
        </motion.div>

        {/* Full page skeleton with shimmer effects */}
        <GrovePageSkeleton />
      </main>

      {/* Floating decorative element */}
      <motion.div
        className="fixed bottom-10 right-10 text-sage-200 opacity-20 pointer-events-none"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className="w-20 h-20" />
      </motion.div>
    </div>
  );
}
