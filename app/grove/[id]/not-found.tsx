"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Leaf, Home, Search, Plus } from "lucide-react";

/**
 * 404 page for grove routes.
 * Shown when a grove is not found.
 * Features playful animations and helpful suggestions.
 */
export default function GroveNotFound() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-20 right-1/4 w-56 h-56 bg-terracotta-100 rounded-full blur-3xl opacity-40"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-48 h-48 bg-clay-200/20 rounded-full blur-3xl opacity-40"
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header showBack />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* Animated icon */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* Background circle */}
            <motion.div
              className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-terracotta-50 to-terracotta-100 flex items-center justify-center shadow-soft"
              animate={{
                boxShadow: [
                  "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
                  "0 8px 30px -4px rgba(0, 0, 0, 0.1)",
                  "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  y: [0, -2, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search className="w-10 h-10 text-terracotta-400" />
              </motion.div>
            </motion.div>

            {/* Floating question marks */}
            {["?", "?", "?"].map((q, i) => (
              <motion.span
                key={i}
                className="absolute text-terracotta-300 font-bold text-lg"
                style={{
                  left: `${25 + i * 25}%`,
                  top: `${-10 + (i % 2) * 20}%`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [-10, -30, -50],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              >
                {q}
              </motion.span>
            ))}
          </motion.div>

          {/* Message */}
          <motion.h1
            className="text-2xl font-semibold text-foreground mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Grove not found
          </motion.h1>

          <motion.p
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            This grove may have been deleted or the link is incorrect.
            Don&apos;t worry, there are plenty of other plants to tend to!
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/create-grove">
                <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Create New Grove
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Helpful tips */}
          <motion.div
            className="mt-10 p-4 bg-terracotta-50 rounded-xl border border-terracotta-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Tip:</span> Make sure you have
              the correct grove link. Grove URLs are case-sensitive and unique to each garden.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Decorative floating leaf */}
      <motion.div
        className="fixed bottom-10 right-10 text-terracotta-200 opacity-20 pointer-events-none"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className="w-16 h-16" />
      </motion.div>
    </div>
  );
}
