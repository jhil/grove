"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Leaf, Home, Flower2, TreeDeciduous } from "lucide-react";

/**
 * Global 404 page with delightful animations.
 * Features a wilting plant metaphor and encouraging message.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-32 left-1/4 w-72 h-72 bg-sage-100 rounded-full blur-3xl opacity-40"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-1/4 w-64 h-64 bg-terracotta-200/30 rounded-full blur-3xl opacity-40"
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* Animated plant illustration */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pot */}
            <motion.div
              className="relative mx-auto w-24 h-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-14 bg-terracotta-400 rounded-b-2xl rounded-t-lg" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-4 bg-terracotta-500 rounded-full" />

              {/* Wilted plant */}
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-sage-400"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Leaf className="w-12 h-12 transform rotate-45" />
              </motion.div>
            </motion.div>

            {/* Floating leaves (fallen) */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-sage-300"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${60 + i * 10}%`,
                }}
                initial={{ opacity: 0, y: -20, rotate: 0 }}
                animate={{
                  opacity: [0, 0.6, 0.6],
                  y: [0, 20, 20],
                  rotate: [0, 45, 90],
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.2,
                  ease: "easeOut",
                }}
              >
                <Leaf className="w-4 h-4" />
              </motion.div>
            ))}
          </motion.div>

          {/* 404 number with animation */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <span className="text-8xl font-bold text-sage-200 font-display">404</span>
          </motion.div>

          {/* Message */}
          <motion.h1
            className="text-2xl font-semibold text-foreground mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Page not found
          </motion.h1>

          <motion.p
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Looks like this page has wilted away. Let&apos;s get you back to greener pastures.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
                  <Flower2 className="w-4 h-4" />
                  Create Grove
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Fun suggestion */}
          <motion.p
            className="text-xs text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Or maybe try watering your plants? They miss you.
          </motion.p>
        </div>
      </main>

      {/* Decorative floating elements */}
      <motion.div
        className="fixed bottom-10 left-10 text-sage-200 opacity-20 pointer-events-none"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <TreeDeciduous className="w-16 h-16" />
      </motion.div>

      <motion.div
        className="fixed top-32 right-10 text-terracotta-200 opacity-20 pointer-events-none"
        animate={{
          y: [0, -8, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flower2 className="w-12 h-12" />
      </motion.div>
    </div>
  );
}
