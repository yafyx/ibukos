"use client";

import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ibukos/ui/components/button";
import { cn } from "@ibukos/ui/lib/utils";
import { useState } from "react";

import { SectionHeading } from "@/components/kos/section-heading";

import { cityLabels, listingCoords } from "@/domain/kos/labels";
import type { Gender, KosDetail } from "@/domain/kos/types";

const pinClass: Record<Gender, string> = {
	campur: "bg-gender-campur",
	putra: "bg-gender-putra",
	putri: "bg-gender-putri",
};

const MIN_SPAN = 0.004;
const MAX_SPAN = 0.035;
const DEFAULT_SPAN = 0.012;

function bbox(lat: number, lng: number, span: number) {
	const latSpan = span * 0.72;
	return `${lng - span},${lat - latSpan},${lng + span},${lat + latSpan}`;
}

export function LocationMap({ listing }: { listing: KosDetail }) {
	const { lat, lng } = listingCoords(listing.slug, listing.city);
	const [span, setSpan] = useState(DEFAULT_SPAN);
	const [loaded, setLoaded] = useState(false);
	const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox(lat, lng, span)}&layer=mapnik`;
	const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`;
	const canZoomIn = span > MIN_SPAN + 0.0001;
	const canZoomOut = span < MAX_SPAN - 0.0001;

	return (
		<section
			className="flex h-full min-h-0 scroll-mt-28 flex-col gap-2"
			id="lokasi"
		>
			<SectionHeading>Lokasi</SectionHeading>
			<div className="relative min-h-64 flex-1">
				<div className="kos-map-shell absolute inset-0 overflow-hidden">
					<iframe
						className={cn(
							"kos-map-frame absolute inset-[-8%] size-[116%] border-0 transition-[opacity,filter] duration-[180ms] ease-[var(--ease-out)] motion-reduce:transition-none",
							loaded ? "opacity-100" : "opacity-70 blur-[2px]",
						)}
						key={src}
						onLoad={() => setLoaded(true)}
						src={src}
						tabIndex={-1}
						title={`Peta ${listing.area}, ${cityLabels[listing.city]}`}
					/>
					<a
						className="absolute inset-0 z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						href={mapsHref}
						rel="noreferrer"
						target="_blank"
					>
						<span className="sr-only">Buka {listing.address} di peta</span>
					</a>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
					>
						<span
							className={cn(
								"size-3.5 rounded-full shadow-[0_0_0_3px_oklch(1_0_0/0.92),0_4px_12px_oklch(0_0_0/0.28)]",
								pinClass[listing.gender],
							)}
						/>
					</div>
				</div>
				<p className="pointer-events-none absolute start-4 bottom-4 z-20 rounded-full bg-background/90 px-3 py-1 font-medium text-xs shadow-sm backdrop-blur-[2px]">
					{listing.area}
				</p>
				<div className="absolute end-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
					<Button
						aria-label="Perbesar peta"
						className="size-8 rounded-full bg-background shadow-md disabled:opacity-40"
						disabled={!canZoomIn}
						onClick={() => {
							setLoaded(false);
							setSpan((current) => Math.max(MIN_SPAN, current * 0.58));
						}}
						size="icon"
						variant="outline"
					>
						<HugeiconsIcon
							aria-hidden="true"
							className="size-3.5"
							icon={PlusSignIcon}
						/>
					</Button>
					<Button
						aria-label="Perkecil peta"
						className="size-8 rounded-full bg-background shadow-md disabled:opacity-40"
						disabled={!canZoomOut}
						onClick={() => {
							setLoaded(false);
							setSpan((current) => Math.min(MAX_SPAN, current / 0.58));
						}}
						size="icon"
						variant="outline"
					>
						<HugeiconsIcon
							aria-hidden="true"
							className="size-3.5"
							icon={MinusSignIcon}
						/>
					</Button>
				</div>
			</div>
		</section>
	);
}
