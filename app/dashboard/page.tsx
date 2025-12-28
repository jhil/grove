"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/hooks/use-auth";
import { useMyOwnedGroves } from "@/hooks/use-grove";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
	Flower,
	Plus,
	ArrowRight,
	Loader2,
	ShoppingBasket,
	HouseHeart,
} from "lucide-react";
import { transition } from "@/lib/motion";

/**
 * Dashboard page for logged-in users
 * Shows groves, quick actions, and personalized content
 */
export default function DashboardPage() {
	const router = useRouter();
	const { user, profile, isAuthenticated, isLoading } = useAuth();
	const { data: groves = [], isLoading: grovesLoading } = useMyOwnedGroves();

	// Redirect if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/");
		}
	}, [isLoading, isAuthenticated, router]);

	if (isLoading || grovesLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={transition.enter}
				>
					<Loader2 className="w-6 h-6 animate-spin text-terracotta-500" />
				</motion.div>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		return null;
	}

	const displayName = profile?.display_name || user.email?.split("@")[0] || "Plant Parent";
	const greeting = getGreeting();

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav
				className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30"
				aria-label="Main navigation"
			>
				<div className="flex items-center justify-between px-6 py-4 lg:px-12">
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-7 h-7 rounded-lg bg-terracotta-100 flex items-center justify-center transition-colors group-hover:bg-terracotta-200">
							<Flower className="w-3.5 h-3.5 text-terracotta-600" />
						</div>
						<span className="font-medium text-foreground tracking-tight">
							Plangrove
						</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="/shop"
							className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							<ShoppingBasket className="w-4 h-4" />
							<span className="hidden sm:inline">Shop</span>
						</Link>
						<Link href="/profile">
							<Avatar email={user.email} name={profile?.display_name} size="md" />
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="pt-20 pb-12">
				{/* Header */}
				<header className="px-6 lg:px-12 py-12">
					<motion.p
						className="text-sm text-muted-foreground mb-3 tracking-wide uppercase"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ ...transition.enter, delay: 0.1 }}
					>
						{greeting}
					</motion.p>
					<motion.h1
						className="text-4xl lg:text-5xl font-semibold text-foreground tracking-tight"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...transition.slow, delay: 0.15 }}
					>
						Welcome back, {displayName}
					</motion.h1>
				</header>

				{/* Quick Actions */}
				<motion.section
					className="px-6 lg:px-12 mb-12"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...transition.enter, delay: 0.2 }}
				>
					<div className="flex flex-wrap gap-3">
						<Link href="/create-grove">
							<Button className="group">
								<Plus className="w-4 h-4 mr-2" />
								Create a grove
							</Button>
						</Link>
						<Link href="/profile">
							<Button variant="secondary">Edit profile</Button>
						</Link>
					</div>
				</motion.section>

				{/* Groves Grid */}
				<section className="px-6 lg:px-12">
					<motion.div
						className="flex items-center gap-3 mb-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ ...transition.enter, delay: 0.25 }}
					>
						<div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
							<HouseHeart className="w-5 h-5" />
						</div>
						<h2 className="text-xl font-medium text-foreground">Your Groves</h2>
					</motion.div>

					{groves.length === 0 ? (
						<motion.div
							className="text-center py-16 px-6 bg-terracotta-50/50 rounded-2xl"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...transition.enter, delay: 0.3 }}
						>
							<div className="w-16 h-16 rounded-2xl bg-terracotta-100 flex items-center justify-center mx-auto mb-6">
								<HouseHeart className="w-8 h-8 text-terracotta-500" />
							</div>
							<h3 className="text-lg font-medium text-foreground mb-2">
								No groves yet
							</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">
								Create your first grove to start tracking and sharing plant care
								with others.
							</p>
							<Link href="/create-grove">
								<Button className="group">
									Create your first grove
									<ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
								</Button>
							</Link>
						</motion.div>
					) : (
						<motion.div
							className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...transition.enter, delay: 0.3 }}
						>
							{groves.map((grove, index) => (
								<Link
									key={grove.id}
									href={`/grove/${grove.id}`}
									className="group"
								>
									<motion.div
										className="p-6 rounded-2xl bg-white border border-border/30 hover:border-terracotta-300 hover:shadow-soft transition-all"
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ ...transition.enter, delay: 0.3 + index * 0.05 }}
									>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta-600 group-hover:bg-terracotta-200 transition-colors">
												<HouseHeart className="w-6 h-6" />
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-medium text-foreground truncate group-hover:text-terracotta-700 transition-colors">
													{grove.name}
												</h3>
												<p className="text-sm text-muted-foreground">
													Updated {formatRelativeTime(grove.updated_at)}
												</p>
											</div>
											<ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
										</div>
									</motion.div>
								</Link>
							))}
						</motion.div>
					)}
				</section>
			</main>
		</div>
	);
}

/**
 * Get a greeting based on time of day
 */
function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}

/**
 * Format a relative time string
 */
function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}
