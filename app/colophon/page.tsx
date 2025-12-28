import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Flower } from "lucide-react";

export const metadata: Metadata = {
	title: "Colophon - Plangrove",
	description: "Credits and acknowledgments for Plangrove",
};

const photographers = [
	{
		name: "Pablo Merchán Montes",
		image: "/img/plant-room.jpg",
		imageAlt: "A room filled with lots of plants and furniture",
		unsplashUrl:
			"https://unsplash.com/photos/a-room-filled-with-lots-of-plants-and-furniture-hFKZ5-OT9Ys",
		unsplashUsername: "pablomerchanm",
	},
	{
		name: "Curated Lifestyle",
		image: "/img/foliage-closeup.jpg",
		imageAlt: "Closeup of green foliage plants in a garden",
		unsplashUrl:
			"https://unsplash.com/photos/closeup-of-green-foliages-plants-in-a-garden-mWME2TYbs_s",
		unsplashUsername: "curatedlifestyle",
	},
	{
		name: "Khanh Do",
		image: "/img/kitchen-counter.jpg",
		imageAlt: "A kitchen counter with a potted plant on top of it",
		unsplashUrl:
			"https://unsplash.com/photos/a-kitchen-counter-with-a-potted-plant-on-top-of-it-necy6c3gW88",
		unsplashUsername: "khanhdo",
	},
	{
		name: "Kailun Zhang",
		image: "/img/reading-plants.jpg",
		imageAlt: "Woman reading a book surrounded by lush green plants",
		unsplashUrl:
			"https://unsplash.com/photos/woman-reading-a-book-surrounded-by-lush-green-plants-v-2DNyyziGs",
		unsplashUsername: "kailunzhang",
	},
	{
		name: "Daiga Ellaby",
		image: "/img/kitchen-shelves.jpg",
		imageAlt: "A kitchen with a sink and shelves filled with plants",
		unsplashUrl:
			"https://unsplash.com/photos/a-kitchen-with-a-sink-and-shelves-filled-with-plants-mVnft46UU1Y-unsplash",
		unsplashUsername: "daiga_ellaby",
	},
	{
		name: "Getty Images",
		image: "/img/community-garden.jpg",
		imageAlt:
			"Senior women friends planting vegetables in a greenhouse at a community garden",
		unsplashUrl:
			"https://unsplash.com/photos/senior-woman-friends-planting-vegetables-in-a-greenhouse-at-community-garden-RspW1UABcrs",
		unsplashUsername: "gettyimages",
	},
];

export default function ColophonPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="px-6 lg:px-12 py-6 border-b border-border/30">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-7 h-7 rounded-lg bg-terracotta-100 flex items-center justify-center transition-colors group-hover:bg-terracotta-200">
							<Flower className="w-3.5 h-3.5 text-terracotta-600" />
						</div>
						<span className="font-medium text-foreground tracking-tight">
							Plangrove
						</span>
					</Link>
					<Link
						href="/"
						className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back
					</Link>
				</div>
			</header>

			{/* Content */}
			<main className="px-6 lg:px-12 py-16 lg:py-24">
				<div className="max-w-4xl">
					<h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight mb-6">
						Colophon
					</h1>
					<p className="text-lg text-muted-foreground mb-16 max-w-2xl">
						Plangrove is made with care. We&apos;re grateful to the
						photographers whose work brings our pages to life.
					</p>

					{/* Photography Credits */}
					<section className="mb-20">
						<h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-8">
							Photography
						</h2>
						<div className="grid gap-8">
							{photographers.map((photographer) => (
								<div
									key={photographer.name}
									className="flex flex-col sm:flex-row gap-6 items-start"
								>
									<div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
										<Image
											src={photographer.image}
											alt={photographer.imageAlt}
											fill
											className="object-cover"
											sizes="(max-width: 640px) 100vw, 160px"
										/>
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-medium text-foreground mb-1">
											{photographer.name}
										</h3>
										<p className="text-sm text-muted-foreground mb-3">
											{photographer.imageAlt}
										</p>
										<a
											href={photographer.unsplashUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 text-sm text-terracotta-600 hover:text-terracotta-700 transition-colors"
										>
											View on Unsplash
											<ExternalLink className="w-3.5 h-3.5" />
										</a>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* Technology */}
					<section className="mb-20">
						<h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-8">
							Built with
						</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								{ name: "Claude Code", description: "AI-assisted development" },
								{ name: "Next.js", description: "React framework" },
								{ name: "Tailwind CSS", description: "Utility-first styling" },
								{ name: "Supabase", description: "Database & auth" },
								{ name: "Cloudflare", description: "Edge deployment" },
								{ name: "Motion", description: "Animations" },
								{ name: "Lucide", description: "Icon library" },
								{ name: "Base UI", description: "Accessible components" },
							].map((tech) => (
								<div key={tech.name} className="p-4 rounded-xl bg-terracotta-50/50">
									<h3 className="font-medium text-foreground">{tech.name}</h3>
									<p className="text-sm text-muted-foreground">
										{tech.description}
									</p>
								</div>
							))}
						</div>
					</section>

					{/* Typography */}
					<section>
						<h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-8">
							Typography
						</h2>
						<div className="p-6 rounded-xl bg-terracotta-50/50">
							<h3 className="font-medium text-foreground mb-2">Denim INK</h3>
							<p className="text-muted-foreground mb-3">
								Plangrove uses Denim INK, a sans-serif typeface with rounded
								inner corners inspired by screenprinting on denim fabric.
							</p>
							<a
								href="https://displaay.net/typeface/denim-collection/denim-ink-wd/"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 text-sm text-terracotta-600 hover:text-terracotta-700 transition-colors"
							>
								Displaay Type Foundry
								<ExternalLink className="w-3.5 h-3.5" />
							</a>
						</div>
					</section>
				</div>
			</main>

			{/* Footer */}
			<footer className="px-6 lg:px-12 py-12 border-t border-border/30">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 rounded-md bg-terracotta-100 flex items-center justify-center">
							<Flower className="w-3 h-3 text-terracotta-600" />
						</div>
						<span className="text-sm text-muted-foreground">Plangrove</span>
					</div>
					<a
						href="https://jeffanders.co"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Made by Jeff Anders
					</a>
				</div>
			</footer>
		</div>
	);
}
