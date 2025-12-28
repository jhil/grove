"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMyGroves } from "@/hooks/use-my-groves";
import { useToast } from "@/components/ui/toast";
import { transition } from "@/lib/motion";
import {
  Flower,
  ArrowLeft,
  Check,
  Home,
  Leaf,
  Loader2,
} from "lucide-react";

/**
 * Google Home account linking consent page.
 * Users select which groves to connect to Google Home.
 */
export default function GoogleHomeLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { groves } = useMyGroves();
  const { showToast } = useToast();

  const [selectedGroves, setSelectedGroves] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get OAuth parameters from URL
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const returnUrl = `/google-home/link?${searchParams.toString()}`;
      router.push(`/login?next=${encodeURIComponent(returnUrl)}&google_home=true`);
    }
  }, [authLoading, user, router, searchParams]);

  // Validate OAuth parameters
  useEffect(() => {
    if (!clientId || !redirectUri || !state) {
      showToast("Invalid linking request", "error");
      router.push("/dashboard");
    }
  }, [clientId, redirectUri, state, router, showToast]);

  // Toggle grove selection
  const toggleGrove = (groveId: string) => {
    setSelectedGroves((prev) => {
      const next = new Set(prev);
      if (next.has(groveId)) {
        next.delete(groveId);
      } else {
        next.add(groveId);
      }
      return next;
    });
  };

  // Select all groves
  const selectAll = () => {
    setSelectedGroves(new Set(groves.map((g) => g.id)));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedGroves.size === 0) {
      showToast("Please select at least one grove", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save linked groves and generate auth code
      const response = await fetch("/api/google-home/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groveIds: Array.from(selectedGroves),
          redirectUri,
          state,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link account");
      }

      setIsSuccess(true);
      showToast("Connected to Google Home!", "success");

      // Redirect to Google with auth code
      setTimeout(() => {
        window.location.href = data.redirectUrl;
      }, 1000);
    } catch (error) {
      console.error("Link error:", error);
      showToast("Failed to connect. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Cancel</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-terracotta-100 flex items-center justify-center transition-colors group-hover:bg-terracotta-200">
              <Flower className="w-3.5 h-3.5 text-terracotta-600" />
            </div>
            <span className="font-medium text-foreground tracking-tight">
              Plangrove
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen flex">
        {/* Left Column - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-24 pt-20 pb-12">
          <div className="max-w-md">
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.1 }}
            >
              <Home className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground tracking-wide uppercase">
                Google Home
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.slow, delay: 0.15 }}
            >
              Connect your
              <br />
              <span className="text-terracotta-500">plants</span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.25 }}
            >
              Select which groves to connect to Google Home. Your plants will
              appear as devices you can check on and water using voice commands.
            </motion.p>

            {/* Grove Selection */}
            <motion.div
              className="space-y-3 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.enter, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Your Groves
                </label>
                {groves.length > 1 && (
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-sm text-terracotta-600 hover:text-terracotta-700 transition-colors"
                  >
                    Select all
                  </button>
                )}
              </div>

              {groves.length === 0 ? (
                <div className="p-6 bg-cream-50 rounded-lg border border-border/50 text-center">
                  <Leaf className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No groves found. Create a grove first to connect it to
                    Google Home.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groves.map((grove) => (
                    <button
                      key={grove.id}
                      type="button"
                      onClick={() => toggleGrove(grove.id)}
                      disabled={isSubmitting || isSuccess}
                      className={`w-full p-4 rounded-lg border transition-all text-left flex items-center gap-3 ${
                        selectedGroves.has(grove.id)
                          ? "border-terracotta-500 bg-terracotta-50"
                          : "border-border hover:border-terracotta-300 bg-background"
                      } ${isSubmitting || isSuccess ? "opacity-60" : ""}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedGroves.has(grove.id)
                            ? "border-terracotta-500 bg-terracotta-500"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {selectedGroves.has(grove.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {grove.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          plangrove.app/grove/{grove.id}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.35 }}
            >
              <Button
                size="lg"
                className="w-full h-12 text-base"
                disabled={
                  selectedGroves.size === 0 ||
                  isSubmitting ||
                  isSuccess ||
                  groves.length === 0
                }
                onClick={handleSubmit}
              >
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.span
                      key="success"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Check className="w-4 h-4" />
                      Connected
                    </motion.span>
                  ) : isSubmitting ? (
                    <motion.span
                      key="submitting"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Home className="w-4 h-4" />
                      Connect to Google Home
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Info */}
            <motion.p
              className="text-sm text-muted-foreground mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.4 }}
            >
              You can manage your Google Home connection from grove settings at
              any time.
            </motion.p>
          </div>
        </div>

        {/* Right Column - Visual */}
        <motion.div
          className="hidden lg:flex flex-1 bg-terracotta-50/50 items-center justify-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.slow, delay: 0.2 }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-terracotta-200/30 rounded-full blur-3xl"
              animate={{ scale: [1, 1.1, 1], x: [0, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-terracotta-200/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.15, 1], y: [0, -15, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-sm px-8">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-white shadow-lifted flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.4 }}
            >
              <Home className="w-10 h-10 text-terracotta-500" />
            </motion.div>
            <motion.h2
              className="text-2xl font-medium text-foreground tracking-tight mb-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition.enter, delay: 0.5 }}
            >
              Voice control
            </motion.h2>
            <motion.p
              className="text-muted-foreground leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.6 }}
            >
              After connecting, you can ask Google Assistant about your plants:
            </motion.p>
            <motion.div
              className="space-y-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition.enter, delay: 0.7 }}
            >
              <div className="p-3 bg-white/80 rounded-lg">
                &quot;Hey Google, check my plants&quot;
              </div>
              <div className="p-3 bg-white/80 rounded-lg">
                &quot;Hey Google, water my fern&quot;
              </div>
              <div className="p-3 bg-white/80 rounded-lg">
                &quot;Hey Google, is my snake plant thirsty?&quot;
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
