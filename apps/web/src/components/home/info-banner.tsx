import { Button } from "@ibukos/ui/components/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@ibukos/ui/components/card";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { KosImage } from "@/components/media/kos-image";
import { buildCariSearch } from "@/domain/facets/url";
import type { InfoBannerContent } from "@/domain/kos/home-content";

export function InfoBanner({
	banner,
	variant = "default",
}: {
	banner: InfoBannerContent;
	variant?: "default" | "accent";
}) {
	return (
		<Card
			className={cn(
				// Mobile: compact row with a square thumbnail. Desktop: text + tall image panel.
				"grid grid-cols-[5.5rem_1fr] items-stretch gap-0 overflow-hidden py-0 sm:grid-cols-[1fr_minmax(10rem,16rem)]",
				variant === "accent" && "border-primary/20 bg-primary/[0.04]",
			)}
		>
			<CardPanel className="p-0 sm:order-last">
				<KosImage
					alt=""
					aria-hidden="true"
					className="size-full object-cover sm:min-h-36"
					height={240}
					src={banner.image}
					width={360}
				/>
			</CardPanel>
			<CardHeader className="justify-center gap-2 px-4 py-4 sm:gap-3 sm:px-6 sm:py-6">
				<CardTitle className="text-pretty font-heading font-semibold text-sm leading-snug tracking-tight sm:text-lg">
					{banner.title}
				</CardTitle>
				<CardDescription className="line-clamp-2 text-pretty text-xs sm:line-clamp-none sm:text-sm">
					{banner.description}
				</CardDescription>
				<Button
					className="mt-0.5 self-start sm:mt-0"
					render={
						<Link
							aria-label={`${banner.cta}: ${banner.title}`}
							search={buildCariSearch(banner.query)}
							to="/cari"
						/>
					}
					size="sm"
					variant={variant === "accent" ? "default" : "outline"}
				>
					{banner.cta}
				</Button>
			</CardHeader>
		</Card>
	);
}
