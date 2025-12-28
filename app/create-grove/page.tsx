"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Confetti } from "@/components/ui/confetti";
import { useCreateGrove } from "@/hooks/use-grove";
import { useToast } from "@/components/ui/toast";
import { generateSlug } from "@/lib/database/groves";
import {
	Leaf,
	ArrowLeft,
	ArrowRight,
	Check,
	Sparkles,
	Flower,
	MapPin,
} from "lucide-react";
import { transition } from "@/lib/motion";

/**
 * Page for creating a new grove.
 * Editorial layout with serene animations.
 */
export default function CreateGrovePage() {
	const router = useRouter();
	const { showToast } = useToast();
	const createGrove = useCreateGrove();

	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			showToast("Please enter a grove name", "error");
			return;
		}

		setIsSubmitting(true);

		try {
			const grove = await createGrove.mutateAsync({
				name: name.trim(),
				location: location.trim() || undefined,
			});

			setIsSuccess(true);
			setShowConfetti(true);
			showToast(`${grove.name} created!`, "success");

			// Short delay to show success state before navigating
			setTimeout(() => {
				router.push(`/grove/${grove.id}`);
			}, 1200);
		} catch (error) {
			console.error("Failed to create grove:", error);
			showToast("Failed to create grove. Please try again.", "error");
			setIsSubmitting(false);
		}
	};

	// Generate preview URL from name
	const previewSlug = generateSlug(name);

	return (
		<div className="min-h-screen bg-background">
			{/* Confetti celebration on success */}
			<Confetti active={showConfetti} duration={2000} count={50} />

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
			<main className="min-h-screen flex">
				{/* Left Column - Form */}
				<div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-24 pt-20 pb-12">
					<div className="max-w-md">
						<motion.p
							className="text-sm text-muted-foreground mb-3 tracking-wide uppercase"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ ...transition.enter, delay: 0.1 }}
						>
							New grove
						</motion.p>

						<motion.h1
							className="text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...transition.slow, delay: 0.15 }}
						>
							Create your
							<br />
							<span className="text-terracotta-500">grove</span>
						</motion.h1>

						<motion.p
							className="text-muted-foreground mb-10 leading-relaxed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ ...transition.enter, delay: 0.25 }}
						>
							A grove is a shared space for managing plants together. Give it a
							name that reflects its purpose.
						</motion.p>

						<motion.form
							onSubmit={handleSubmit}
							className="space-y-6"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...transition.enter, delay: 0.3 }}
						>
							{/* Name Input */}
							<div className="space-y-2">
								<label
									htmlFor="grove-name"
									className="text-sm font-medium text-foreground"
								>
									Grove Name
								</label>
								<Input
									id="grove-name"
									type="text"
									placeholder="Office Plants, Living Room, Garden Club..."
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={isSubmitting || isSuccess}
									autoFocus
									maxLength={50}
									className="h-12 text-base"
								/>
								<p className="text-xs text-muted-foreground">
									{name.length}/50 characters
								</p>
							</div>

							{/* Location Input */}
							<div className="space-y-2">
								<label
									htmlFor="grove-location"
									className="text-sm font-medium text-foreground"
								>
									Location{" "}
									<span className="text-muted-foreground font-normal">
										(optional)
									</span>
								</label>
								<div className="relative">
									<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										id="grove-location"
										type="text"
										placeholder="Brooklyn, NY or 90210"
										value={location}
										onChange={(e) => setLocation(e.target.value)}
										disabled={isSubmitting || isSuccess}
										maxLength={100}
										className="h-12 text-base pl-10"
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									For local weather and watering reminders
								</p>
							</div>

							{/* URL Preview */}
							<AnimatePresence>
								{name.trim() && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={transition.fast}
										className="overflow-hidden"
									>
										<div className="p-4 bg-cream-50 rounded-lg border border-border/50">
											<div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
												<Sparkles className="w-3 h-3 text-terracotta-500" />
												Your grove will be available at
											</div>
											<code className="text-sm font-mono text-foreground">
												plangrove.app/grove/{previewSlug || "..."}
											</code>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Submit Button */}
							<Button
								type="submit"
								size="lg"
								className="w-full h-12 text-base"
								disabled={!name.trim() || isSubmitting || isSuccess}
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
											Created
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
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: "linear",
												}}
											>
												<Flower className="w-4 h-4" />
											</motion.div>
											Creating...
										</motion.span>
									) : (
										<motion.span
											key="default"
											className="flex items-center gap-2"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
										>
											Create grove
											<ArrowRight className="w-4 h-4" />
										</motion.span>
									)}
								</AnimatePresence>
							</Button>
						</motion.form>

						{/* Tip */}
						<motion.p
							className="text-sm text-muted-foreground mt-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ ...transition.enter, delay: 0.4 }}
						>
							You can change the name anytime from grove settings.
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
							<Leaf className="w-10 h-10 text-terracotta-500" />
						</motion.div>
						<motion.h2
							className="text-2xl font-medium text-foreground tracking-tight mb-3"
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...transition.enter, delay: 0.5 }}
						>
							Share with your team
						</motion.h2>
						<motion.p
							className="text-muted-foreground leading-relaxed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ ...transition.enter, delay: 0.6 }}
						>
							After creating your grove, you&apos;ll get a link to share. Anyone
							with the link can view and help care for plants.
						</motion.p>
					</div>
				</motion.div>
			</main>
		</div>
	);
}
