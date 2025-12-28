"use client";

import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { useState } from "react";

/**
 * Update Prompt - shows when a new version of the app is available
 */
export function UpdatePrompt() {
  const { update } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-terracotta-600 text-white rounded-2xl shadow-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium">Update Available</h4>
              <p className="text-sm text-white/80 mt-0.5">
                A new version of Plangrove is ready.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={update}
                  className="bg-white text-terracotta-700 hover:bg-white/90"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDismissed(true)}
                  className="text-white hover:bg-white/10"
                >
                  Later
                </Button>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
