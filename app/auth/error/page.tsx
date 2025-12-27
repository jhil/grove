"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "An authentication error occurred.";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-terracotta-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-terracotta-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Authentication Error
          </h1>
          <p className="text-muted-foreground mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
