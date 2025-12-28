"use client";

import Image from "next/image";
import { getGravatarUrl } from "@/lib/utils/gravatar";
import { cn } from "@/lib/utils";

interface AvatarProps {
	email?: string | null;
	name?: string | null;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeClasses = {
	sm: "w-6 h-6",
	md: "w-8 h-8",
	lg: "w-10 h-10",
	xl: "w-16 h-16",
} as const;

const imageSizes = {
	sm: 24,
	md: 32,
	lg: 40,
	xl: 64,
} as const;

/**
 * Avatar component that displays a Gravatar or initials fallback
 */
export function Avatar({ email, name, size = "md", className }: AvatarProps) {
	const gravatarUrl = getGravatarUrl(email, imageSizes[size] * 2); // 2x for retina
	const initials = getInitials(name || email);

	return (
		<div
			className={cn(
				"relative rounded-full overflow-hidden bg-terracotta-100 flex items-center justify-center flex-shrink-0",
				sizeClasses[size],
				className
			)}
		>
			{email ? (
				<Image
					src={gravatarUrl}
					alt={name || email || "User avatar"}
					fill
					className="object-cover"
					sizes={`${imageSizes[size]}px`}
				/>
			) : (
				<span
					className={cn(
						"font-medium text-terracotta-600 uppercase",
						size === "sm" && "text-xs",
						size === "md" && "text-xs",
						size === "lg" && "text-sm",
						size === "xl" && "text-lg"
					)}
				>
					{initials}
				</span>
			)}
		</div>
	);
}

/**
 * Get initials from a name or email
 */
function getInitials(nameOrEmail: string | null | undefined): string {
	if (!nameOrEmail) return "?";

	// If it's an email, use the first letter of the local part
	if (nameOrEmail.includes("@")) {
		return nameOrEmail.split("@")[0].charAt(0);
	}

	// Get initials from name (first and last name initials)
	const parts = nameOrEmail.trim().split(/\s+/);
	if (parts.length >= 2) {
		return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
	}
	return parts[0].charAt(0);
}
