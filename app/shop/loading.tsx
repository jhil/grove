"use client";

import { motion } from "motion/react";
import { Header } from "@/components/shared/header";
import { ShopGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ShoppingBasket } from "lucide-react";

/**
 * Loading state for shop page.
 * Features delightful shimmer animations.
 */
export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-32 left-1/4 w-64 h-64 bg-terracotta-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-terracotta-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -25, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page header skeleton */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta-100 mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBasket className="w-8 h-8 text-terracotta-400" />
          </motion.div>
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-96 max-w-full mx-auto" />
        </motion.div>

        {/* Category filter skeleton */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className="h-9 w-24 rounded-full"
              style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Product grid skeleton */}
        <ShopGridSkeleton count={8} />
      </main>
    </div>
  );
}
