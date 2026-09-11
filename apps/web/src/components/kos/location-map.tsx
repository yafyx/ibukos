"use client";

import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ibukos/ui/components/button";
import { lazy, Suspense, useEffect, useState } from "react";

import { SectionHeading } from "@/components/kos/section-heading";

import { listingCoords } from "@/domain/kos/labels";
import type { KosDetail } from "@/domain/kos/types";

const LocationMapCanvas = lazy(() => import("./location-map-canvas"));

const MIN_ZOOM = 14;
const MAX_ZOOM = 18;
const DEFAULT_ZOOM = 16;

export function LocationMap({ listing }: { listing: KosDetail }) {
	const { lat, lng } = listingCoords(listing.slug, listing.city);
	const [zoom, setZoom] = useState(DEFAULT_ZOOM);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`;
	const canZoomIn = zoom < MAX_ZOOM;
	const canZoomOut = zoom > MIN_ZOOM;

	return (
		<section
			className="flex h-full min-h-0 scroll-mt-28 flex-col gap-2"
			id="lokasi"
		>
			<SectionHeading
				action={
					<a
						className="font-medium text-muted-foreground text-sm underline decoration-foreground/20 underline-offset-2 transition-colors duration-[160ms] ease-[var(--ease-out)] hover:text-foreground hover:decoration-foreground/45"
						href={mapsHref}
						rel="noreferrer"
						target="_blank"
					>
						Buka di Maps
					</a>
				}
			>
				Lokasi
			</SectionHeading>
			<div className="relative min-h-64 flex-1">
				<div className="kos-map-shell absolute inset-0 overflow-hidden">
					{ready ? (
						<Suspense fallback={<div className="absolute inset-0 bg-muted" />}>
							<LocationMapCanvas
								gender={listing.gender}
								lat={lat}
								lng={lng}
								zoom={zoom}
							/>
						</Suspense>
					) : (
						<div className="absolute inset-0 bg-muted" />
					)}
				</div>
				<p className="pointer-events-none absolute start-4 bottom-4 z-20 max-w-[55%] truncate rounded-full bg-background/90 px-3 py-1 font-medium text-xs shadow-sm backdrop-blur-[2px]">
					{listing.area}
				</p>
				<p className="absolute end-4 bottom-4 z-20 rounded-full bg-background/90 px-2 py-0.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur-[2px]">
					©{" "}
					<a
						className="underline decoration-foreground/20 underline-offset-2 hover:text-foreground"
						href="https://www.openstreetmap.org/copyright"
						rel="noreferrer"
						target="_blank"
					>
						OpenStreetMap
					</a>
				</p>
				<div className="absolute end-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
					<Button
						aria-label="Perbesar peta"
						className="size-8 rounded-full bg-background shadow-md disabled:opacity-40"
						disabled={!canZoomIn}
						onClick={() => {
							setZoom((current) => Math.min(MAX_ZOOM, current + 1));
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
							setZoom((current) => Math.max(MIN_ZOOM, current - 1));
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
