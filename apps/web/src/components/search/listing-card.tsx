"use client";

import { Bookmark02Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@ibukos/ui/components/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@ibukos/ui/components/card";
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@ibukos/ui/components/carousel";
import { Toggle } from "@ibukos/ui/components/toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@ibukos/ui/components/tooltip";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KosImage } from "@/components/media/kos-image";
import {
	cityLabels,
	formatPriceIdr,
	formatSavingIdr,
	genderLabels,
} from "@/domain/kos/labels";
import type { KosListing } from "@/domain/kos/types";
import { pressable } from "@/lib/motion";
import { isKosSaved, toggleSavedKos } from "@/lib/saved-kos";

export function ListingCard({ listing }: { listing: KosListing }) {
	const gallery =
		listing.photos && listing.photos.length > 0
			? listing.photos
			: listing.photo
				? [listing.photo]
				: [""];
	const displayPrice = listing.pricePromo ?? listing.priceMonthly;
	const verified =
		listing.badges.includes("andalan") || listing.badges.includes("dikelola");
	const roomsUrgent = listing.roomsAvailable <= 2;
	const titleId = `kos-title-${listing.slug}`;
	const location = [
		listing.area,
		cityLabels[listing.city],
		listing.campus ? `dekat ${listing.campus}` : null,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<Card
			className={`relative gap-0 overflow-hidden p-1 ring-foreground/10 [--card-spacing:--spacing(3)] ${pressable}`}
		>
			<Link
				aria-labelledby={titleId}
				className="absolute inset-0 z-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				params={{ slug: listing.slug }}
				to="/kos/$slug"
			/>
			<ListingGallery
				alt=""
				gallery={gallery}
				gender={listing.gender}
				roomsAvailable={listing.roomsAvailable}
				roomsUrgent={roomsUrgent}
				slug={listing.slug}
			/>
			<CardHeader className="pointer-events-none relative z-10 gap-1.5 px-3 pt-3 pb-0">
				<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
					{listing.rating !== undefined ? (
						<span className="inline-flex items-center gap-1 font-medium tabular-nums">
							<HugeiconsIcon
								aria-hidden="true"
								className="size-3.5 text-warning"
								icon={StarIcon}
							/>
							{listing.rating.toFixed(1)}
						</span>
					) : null}
					{verified ? (
						<Badge className="font-normal" variant="outline">
							Terverifikasi
						</Badge>
					) : null}
				</div>
				<CardTitle
					className="text-pretty font-heading font-medium text-base leading-snug"
					id={titleId}
				>
					{listing.name}
				</CardTitle>
				<CardDescription className="text-pretty">{location}</CardDescription>
				<p className="line-clamp-1 text-muted-foreground text-xs">
					{listing.facilitySnippet}
				</p>
			</CardHeader>
			<CardFooter className="pointer-events-none relative z-10 border-0 px-3 pt-2 pb-3">
				<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
					<span className="font-semibold text-primary tabular-nums">
						{formatPriceIdr(displayPrice)}
						<span className="font-normal text-muted-foreground text-xs">
							/bulan
						</span>
					</span>
					{listing.pricePromo ? (
						<>
							<span className="text-muted-foreground text-xs tabular-nums line-through">
								{formatPriceIdr(listing.priceMonthly)}
							</span>
							<span className="text-success-foreground text-xs">
								{formatSavingIdr(listing.priceMonthly, listing.pricePromo)}
							</span>
						</>
					) : null}
				</div>
			</CardFooter>
		</Card>
	);
}

function ListingGallery({
	alt,
	gallery,
	gender,
	roomsAvailable,
	roomsUrgent,
	slug,
}: {
	alt: string;
	gallery: string[];
	gender: KosListing["gender"];
	roomsAvailable: number;
	roomsUrgent: boolean;
	slug: string;
}) {
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		setSaved(isKosSaved(slug));
	}, [slug]);

	return (
		<div className="relative overflow-hidden">
			<Carousel className="w-full" opts={{ loop: false }}>
				<CarouselContent>
					{gallery.map((photo) => (
						<CarouselItem key={photo}>
							<KosImage
								alt={alt}
								className="aspect-[4/3] size-full object-cover outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10"
								height={300}
								src={photo}
								width={400}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				{gallery.length > 1 ? (
					<>
						<CarouselPrevious className="hover-fine-reveal absolute top-1/2 left-2 z-20 size-8 -translate-y-1/2 bg-background/90" />
						<CarouselNext className="hover-fine-reveal absolute top-1/2 right-2 z-20 size-8 -translate-y-1/2 bg-background/90" />
						<CarouselDots className="absolute inset-x-0 bottom-2 z-20" />
					</>
				) : null}
			</Carousel>
			<div className="pointer-events-none absolute top-2 left-2 z-20 flex flex-wrap gap-1">
				<Badge variant="secondary">{genderLabels[gender]}</Badge>
				{roomsUrgent ? (
					<Badge variant={roomsAvailable > 0 ? "warning" : "error"}>
						{roomsAvailable > 0 ? `Sisa ${roomsAvailable}` : "Penuh"}
					</Badge>
				) : null}
			</div>
			<Tooltip>
				<TooltipTrigger
					render={
						<Toggle
							aria-label={saved ? "Hapus dari simpanan" : "Simpan kos"}
							className="absolute top-2 right-2 z-20 size-8 rounded-none bg-background/90"
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
							}}
							onPressedChange={() => {
								setSaved(toggleSavedKos(slug));
							}}
							pressed={saved}
							size="sm"
							variant="outline"
						>
							<HugeiconsIcon
								aria-hidden="true"
								className={saved ? "text-primary" : undefined}
								icon={Bookmark02Icon}
							/>
						</Toggle>
					}
				/>
				<TooltipContent>
					{saved ? "Hapus dari simpanan" : "Simpan kos"}
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
