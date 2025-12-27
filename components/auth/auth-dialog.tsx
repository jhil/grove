"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Leaf, Mail, Lock, User, Loader2 } from "lucide-react";

/**
 * Authentication dialog with sign in / sign up forms.
 */
interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
}

export function AuthDialog({ open, onOpenChange, defaultMode = "signin" }: AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password, displayName || undefined);
        showToast("Account created! Please check your email to confirm.", "success");
      } else {
        await signIn(email, password);
        showToast("Welcome back!", "success");
      }
      onOpenChange(false);
      // Reset form
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "signin" ? "Sign In" : "Create Account"}
      description={
        mode === "signin"
          ? "Sign in to track your plant care activities"
          : "Create an account to track who waters your plants"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center">
            <Leaf className="w-7 h-7 text-sage-600" />
          </div>
        </div>

        {/* Display Name (signup only) */}
        {mode === "signup" && (
          <div className="space-y-2">
            <label htmlFor="display-name" className="text-sm font-medium text-foreground">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="display-name"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              className="pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="pl-10"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === "signin" ? "Signing in..." : "Creating account..."}
            </>
          ) : (
            <>{mode === "signin" ? "Sign In" : "Create Account"}</>
          )}
        </Button>

        {/* Toggle Mode */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline font-medium"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

/**
 * Small button to trigger auth dialog.
 */
interface AuthButtonProps {
  className?: string;
}

export function AuthButton({ className }: AuthButtonProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading, user, profile } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className={className}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  // Authenticated - show user info and link to account
  if (isAuthenticated && user) {
    const displayName = profile?.display_name || user.email?.split("@")[0] || "Account";

    return (
      <a href="/profile">
        <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
          <User className="w-4 h-4" />
          <span className="hidden sm:inline max-w-[100px] truncate">
            {displayName}
          </span>
        </Button>
      </a>
    );
  }

  // Not authenticated - show sign in button
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className={className}>
        Sign In
      </Button>
      <AuthDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
