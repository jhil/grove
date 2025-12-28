"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Flower, ArrowLeft, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/auth-dialog";

/**
 * App header with logo and optional back navigation.
 * Features subtle animations for a polished feel.
 */
interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  title?: string;
  actions?: React.ReactNode;
}

export function Header({
  showBack = false,
  backHref = "/",
  backLabel = "Back",
  title,
  actions,
}: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side: Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBack && !isHome ? (
            <Link href={backHref}>
              <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <motion.div
                    animate={{ x: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.div>
                  <span className="hidden sm:inline">{backLabel}</span>
                </Button>
              </motion.div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-9 h-9 rounded-full bg-terracotta-100 flex items-center justify-center group-hover:bg-terracotta-200 transition-colors"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flower className="w-5 h-5 text-terracotta-600" />
                </motion.div>
              </motion.div>
              <motion.span
                className="font-display font-bold text-lg text-foreground"
                whileHover={{ color: "var(--terracotta-600)" }}
                transition={{ duration: 0.2 }}
              >
                Plangrove
              </motion.span>
            </Link>
          )}

          {/* Title (when showing back button) */}
          {showBack && title && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-muted-foreground/50">/</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {title}
              </span>
            </motion.div>
          )}
        </div>

        {/* Right side: Actions + Auth */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {actions}
          <Link href="/shop">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ShoppingBasket className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">Shop</span>
              </Button>
            </motion.div>
          </Link>
          <AuthButton />
        </motion.div>
      </div>
    </motion.header>
  );
}
