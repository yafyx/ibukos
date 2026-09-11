"use client";

import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@ibukos/ui/components/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@ibukos/ui/components/card";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ZapIcon } from "lucide-react";
import { KosImage } from "@/components/media/kos-image";
import { SaveKosChip } from "@/components/save-kos-chip";
import {
	cityLabels,
	formatDiscountShortIdr,
	formatPriceIdr,
	genderChipClass,
	genderLabels,
} from "@/domain/kos/labels";
import type { KosListing } from "@/domain/kos/types";
import { listingAlt } from "@/domain/seo/pages";

export type ListingCardVariant = "default" | "featured" | "split";

export function ListingCard({
	listing,
	variant = "featured",
	onHighlightEvent,
}: {
	listing: KosListing;
	variant?: ListingCardVariant;
	onHighlightEvent?: (
		event: "enter" | "leave" | "select",
		input: "pointer" | "keyboard",
	) => void;
}) {
	const photo =
		listing.photos && listing.photos.length > 0
			? listing.photos[0]
			: (listing.photo ?? "");
	const displayPrice = listing.pricePromo ?? listing.priceMonthly;
	const verified =
		listing.badges.includes("andalan") || listing.badges.includes("dikelola");
	const roomsLow = listing.roomsAvailable > 0 && listing.roomsAvailable <= 3;
	const showFullLocation = variant === "default";
	const split = variant === "split";
	const titleId = `kos-title-${listing.slug}`;
	const location = [
		listing.area,
		cityLabels[listing.city],
		listing.campus ? `dekat ${listing.campus}` : null,
	]
		.filter(Boolean)
		.join(" · ");
	const subtitle = showFullLocation ? location : listing.area;
	return (
		<Card
			className={cn(
				"@container/listing relative h-full gap-0 overflow-hidden p-1 ring-foreground/10 ring-inset [--card-spacing:--spacing(3)]",
				split && "flex flex-row",
			)}
		>
			<Link
				aria-labelledby={titleId}
				className={cn(
					"relative z-10 flex h-full min-w-0 flex-col rounded-[calc(var(--radius-xl)-2px)] outline-none focus-visible:ring-2 focus-visible:ring-ring",
					split && "min-w-0 flex-1 flex-row gap-2",
				)}
				onBlur={() => onHighlightEvent?.("leave", "keyboard")}
				onClick={() => onHighlightEvent?.("select", "pointer")}
				onFocus={() => onHighlightEvent?.("enter", "keyboard")}
				onMouseEnter={() => onHighlightEvent?.("enter", "pointer")}
				onMouseLeave={() => onHighlightEvent?.("leave", "pointer")}
				params={{ slug: listing.slug }}
				to="/kos/$slug"
			>
				<div
					className={cn(
						"relative overflow-hidden rounded-lg",
						split && "w-[6.75rem] shrink-0 self-stretch sm:w-28",
					)}
				>
					<KosImage
						alt={listingAlt(listing)}
						className={cn(
							"size-full object-cover outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10",
							split ? "aspect-square min-h-full" : "aspect-[4/3]",
						)}
						fallbackText={listing.name}
						height={split ? 160 : 300}
						src={photo}
						width={split ? 160 : 400}
					/>
					<div className="absolute start-2 top-2 z-10">
						<Badge
							className={genderChipClass[listing.gender]}
							variant="outline"
						>
							{genderLabels[listing.gender]}
						</Badge>
					</div>
				</div>
				<div
					className={cn(
						"flex min-w-0 flex-1 flex-col",
						split && "min-w-0 flex-1",
					)}
				>
					<CardHeader className="gap-1 @[15rem]/listing:px-3 px-2 pt-2 pb-0">
						<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
							{listing.rating !== undefined ? (
								<span className="inline-flex items-center gap-0.5 font-semibold tabular-nums">
									<HugeiconsIcon
										aria-hidden="true"
										className="size-3.5 text-success"
										icon={StarIcon}
									/>
									{listing.rating.toFixed(1)}
								</span>
							) : null}
							{roomsLow ? (
								<span className="text-destructive italic">
									Sisa {listing.roomsAvailable} kamar
								</span>
							) : listing.roomsAvailable === 0 ? (
								<span className="text-destructive italic">Penuh</span>
							) : null}
							{verified ? (
								<Badge className="font-normal" variant="outline">
									Terverifikasi
								</Badge>
							) : null}
						</div>
						<CardTitle
							className="line-clamp-2 text-pretty font-heading font-semibold @[15rem]/listing:text-base text-sm leading-snug"
							id={titleId}
						>
							{listing.name}
						</CardTitle>
						<CardDescription className="line-clamp-1 text-muted-foreground text-xs">
							{subtitle}
						</CardDescription>
						{split ? null : (
							<p className="line-clamp-1 text-muted-foreground text-xs">
								{listing.facilitySnippet}
							</p>
						)}
					</CardHeader>
					<CardFooter className="mt-auto flex flex-col items-start gap-0.5 border-0 @[15rem]/listing:px-3 px-2 pt-2 @[15rem]/listing:pb-3 pb-2">
						{listing.pricePromo ? (
							<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
								<span className="inline-flex items-center gap-0.5 font-semibold text-destructive">
									<ZapIcon aria-hidden="true" className="size-3 fill-current" />
									Diskon{" "}
									{formatDiscountShortIdr(
										listing.priceMonthly,
										listing.pricePromo,
									)}
								</span>
								<span className="text-muted-foreground tabular-nums line-through">
									{formatPriceIdr(listing.priceMonthly)}
								</span>
							</div>
						) : null}
						<div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
							<span className="font-bold @[15rem]/listing:text-base text-foreground text-sm tabular-nums">
								{formatPriceIdr(displayPrice)}
							</span>
							{listing.pricePromo ? (
								<span className="font-normal text-muted-foreground text-xs">
									(Bulan pertama)
								</span>
							) : (
								<span className="font-normal text-muted-foreground text-xs">
									/bulan
								</span>
							)}
						</div>
					</CardFooter>
				</div>
			</Link>
			<SaveKosChip
				className="absolute @[15rem]/listing:end-3 end-2 @[15rem]/listing:top-3 top-2 z-30"
				slug={listing.slug}
			/>
		</Card>
	);
}
