"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateGrove } from "@/hooks/use-grove";
import { useToast } from "@/components/ui/toast";
import { Leaf, Sparkles, ArrowRight, Check } from "lucide-react";

/**
 * Page for creating a new grove.
 * Features delightful animations and visual feedback.
 */
export default function CreateGrovePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createGrove = useCreateGrove();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Please enter a grove name", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const grove = await createGrove.mutateAsync({ name: name.trim() });
      setIsSuccess(true);
      showToast(`${grove.name} created!`, "success");

      // Short delay to show success state before navigating
      setTimeout(() => {
        router.push(`/grove/${grove.id}`);
      }, 800);
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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-sage-200 rounded-full blur-3xl opacity-30"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-terracotta-200 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <Header showBack backHref="/" backLabel="Home" />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-100 mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Leaf className="w-8 h-8 text-sage-600" />
              </motion.div>
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-foreground font-display mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create Your Grove
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              A grove is a shared space for managing plants together.
            </motion.p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
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
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="grove-name"
                        type="text"
                        placeholder="e.g., Office Plants, Living Room, Garden Club"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting || isSuccess}
                        autoFocus
                        maxLength={50}
                        className="transition-all duration-200"
                      />
                    </motion.div>
                    <motion.p
                      className="text-xs text-muted-foreground"
                      animate={{ color: name.length > 45 ? "var(--warning)" : undefined }}
                    >
                      {name.length}/50 characters
                    </motion.p>
                  </div>

                  {/* URL Preview */}
                  <AnimatePresence>
                    {name.trim() && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 bg-cream-100 rounded-xl border border-sage-200">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-4 h-4 text-terracotta-400" />
                            </motion.div>
                            Your grove URL
                          </div>
                          <motion.code
                            className="text-sm font-mono text-sage-700 break-all"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            plangrove.app/grove/{previewSlug || "..."}
                          </motion.code>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: isSubmitting || isSuccess ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting || isSuccess ? 1 : 0.98 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full relative overflow-hidden"
                      disabled={!name.trim() || isSubmitting || isSuccess}
                    >
                      <AnimatePresence mode="wait">
                        {isSuccess ? (
                          <motion.span
                            key="success"
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                            Grove Created!
                          </motion.span>
                        ) : isSubmitting ? (
                          <motion.span
                            key="submitting"
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Leaf className="w-4 h-4" />
                            </motion.div>
                            Creating...
                          </motion.span>
                        ) : (
                          <motion.span
                            key="default"
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            Create Grove
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground">
              After creating your grove, you can add plants and share the link
              with your team.
            </p>
          </motion.div>

          {/* Floating decoration */}
          <motion.div
            className="fixed bottom-10 right-10 text-sage-200 opacity-30 pointer-events-none"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Leaf className="w-24 h-24" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
