import { Flower } from "lucide-react";

/**
 * Root loading state.
 * Displays while the main page content is loading.
 */
export default function Loading() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="w-12 h-12 rounded-xl bg-terracotta-100 flex items-center justify-center animate-pulse">
					<Flower className="w-6 h-6 text-terracotta-600" />
				</div>
				<p className="text-sm text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}
