"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import {
	Mail,
	Calendar,
	LogOut,
	Loader2,
	Check,
	ArrowLeft,
	Flower,
	Bell,
	Settings,
	HouseHeart,
} from "lucide-react";
import { NotificationSettings } from "@/components/pwa/notification-settings";
import { Avatar } from "@/components/ui/avatar";
import { useMyOwnedGroves } from "@/hooks/use-grove";
import { transition } from "@/lib/motion";

/**
 * Profile page - shows user profile and settings
 * Editorial layout with full-width design
 */
export default function ProfilePage() {
	const router = useRouter();
	const { user, profile, isAuthenticated, isLoading, signOut, updateProfile } =
		useAuth();
	const { showToast } = useToast();
	const { data: groves = [], isLoading: grovesLoading } = useMyOwnedGroves();

	const [displayName, setDisplayName] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// Redirect if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/");
		}
	}, [isLoading, isAuthenticated, router]);

	// Initialize display name from profile
	useEffect(() => {
		if (profile?.display_name) {
			setDisplayName(profile.display_name);
		}
	}, [profile]);

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!displayName.trim()) {
			showToast("Name cannot be empty", "error");
			return;
		}

		setIsSaving(true);
		try {
			await updateProfile({ display_name: displayName.trim() });
			showToast("Profile updated!", "success");
		} catch {
			showToast("Failed to update profile", "error");
		} finally {
			setIsSaving(false);
		}
	};

	const handleSignOut = async () => {
		try {
			await signOut();
			showToast("Signed out", "success");
			router.push("/");
		} catch {
			showToast("Failed to sign out", "error");
		}
	};

	if (isLoading) {
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

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30">
				<div className="flex items-center justify-between px-6 lg:px-12 py-4">
					<Link
						href="/"
						className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm">Back</span>
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
			<main className="pt-20 pb-12">
				{/* Header */}
				<header className="px-6 lg:px-12 py-12 border-b border-border/30">
					<motion.p
						className="text-sm text-muted-foreground mb-3 tracking-wide uppercase"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ ...transition.enter, delay: 0.1 }}
					>
						Account
					</motion.p>
					<motion.h1
						className="text-4xl lg:text-5xl font-semibold text-foreground tracking-tight"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...transition.slow, delay: 0.15 }}
					>
						Profile
					</motion.h1>
				</header>

				{/* Content Grid */}
				<div className="grid lg:grid-cols-3 gap-px bg-border/30">
					{/* Profile Section */}
					<motion.section
						className="lg:col-span-2 bg-background p-8 lg:p-12"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ ...transition.enter, delay: 0.2 }}
					>
						<div className="flex items-center gap-4 mb-8">
							<Avatar
								email={user?.email}
								name={profile?.display_name}
								size="xl"
							/>
							<div>
								<h2 className="text-lg font-medium text-foreground">
									{profile?.display_name ||
										user?.email?.split("@")[0] ||
										"Your Profile"}
								</h2>
								<p className="text-sm text-muted-foreground">{user?.email}</p>
							</div>
						</div>

						<form onSubmit={handleSaveProfile} className="space-y-6 max-w-md">
							{/* Name */}
							<div className="space-y-2">
								<label
									htmlFor="display-name"
									className="text-sm font-medium text-foreground"
								>
									Name
								</label>
								<Input
									id="display-name"
									type="text"
									value={displayName}
									onChange={(e) => setDisplayName(e.target.value)}
									placeholder="Your name"
									className="h-11"
								/>
							</div>

							{/* Email (read-only) */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground flex items-center gap-2">
									<Mail className="w-4 h-4 text-muted-foreground" />
									Email
								</label>
								<Input
									type="email"
									value={user.email || ""}
									disabled
									className="h-11 bg-cream-50 text-muted-foreground"
								/>
								<p className="text-xs text-muted-foreground">
									Email cannot be changed
								</p>
							</div>

							{/* Account Created */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground flex items-center gap-2">
									<Calendar className="w-4 h-4 text-muted-foreground" />
									Joined
								</label>
								<p className="text-sm text-muted-foreground">
									{profile?.created_at
										? new Date(profile.created_at).toLocaleDateString(
												undefined,
												{
													year: "numeric",
													month: "long",
													day: "numeric",
												}
										  )
										: user.created_at
										? new Date(user.created_at).toLocaleDateString(undefined, {
												year: "numeric",
												month: "long",
												day: "numeric",
										  })
										: "Unknown"}
								</p>
							</div>

							{/* Save Button */}
							<Button
								type="submit"
								disabled={isSaving || displayName === profile?.display_name}
								className="h-11"
							>
								{isSaving ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Check className="w-4 h-4 mr-2" />
										Save Changes
									</>
								)}
							</Button>
						</form>
					</motion.section>

					{/* Sidebar */}
					<motion.div
						className="bg-background flex flex-col"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ ...transition.enter, delay: 0.3 }}
					>
						{/* My Groves Section */}
						<section className="p-8 lg:p-10 border-b border-border/30">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
									<HouseHeart className="w-5 h-5" />
								</div>
								<h2 className="text-lg font-medium text-foreground">
									My Groves
								</h2>
							</div>
							{groves.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No groves yet. Create one to get started!
								</p>
							) : (
								<div className="space-y-2">
									{groves.slice(0, 5).map((grove) => (
										<Link
											key={grove.id}
											href={`/grove/${grove.id}`}
											className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-terracotta-50 transition-colors"
										>
											<div className="w-8 h-8 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
												<HouseHeart className="w-4 h-4" />
											</div>
											<span className="text-sm font-medium text-foreground truncate">
												{grove.name}
											</span>
										</Link>
									))}
									{groves.length > 5 && (
										<Link
											href="/"
											className="block text-sm text-terracotta-600 hover:text-terracotta-700 transition-colors pt-2"
										>
											View all groves
										</Link>
									)}
								</div>
							)}
						</section>

						{/* Notifications Section */}
						<section className="p-8 lg:p-10 border-b border-border/30">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
									<Bell className="w-5 h-5" />
								</div>
								<h2 className="text-lg font-medium text-foreground">
									Notifications
								</h2>
							</div>
							<NotificationSettings compact />
						</section>

						{/* Account Actions */}
						<section className="p-8 lg:p-10 flex-1">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
									<Settings className="w-5 h-5" />
								</div>
								<h2 className="text-lg font-medium text-foreground">Account</h2>
							</div>
							<p className="text-sm text-muted-foreground mb-4">
								Sign out of your account on this device.
							</p>
							<Button
								variant="secondary"
								onClick={handleSignOut}
								className="w-full"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Sign Out
							</Button>
						</section>
					</motion.div>
				</div>
			</main>
		</div>
	);
}
