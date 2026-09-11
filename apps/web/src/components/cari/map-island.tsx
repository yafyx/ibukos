"use client";

import { Skeleton } from "@ibukos/ui/components/skeleton";
import { lazy, Suspense, useEffect, useState } from "react";

import type { Highlight, HighlightEvent } from "@/domain/cari/highlight";
import type { GeoFit, MapBounds, PlacedListing } from "@/domain/geo";

const MapCanvas = lazy(() => import("./map-canvas"));

export type MapIslandProps = {
	items: readonly PlacedListing[];
	highlight: Highlight;
	fit: GeoFit;
	visible: boolean;
	total: number;
	onHighlightEvent: (event: HighlightEvent) => void;
	onCommitArea: (bounds: MapBounds) => void;
};

export function MapIsland(props: MapIslandProps) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	return (
		<div className="cari-map-island relative z-0 size-full min-h-0 overflow-hidden">
			{ready ? (
				<Suspense fallback={<MapSkeleton />}>
					<MapCanvas {...props} />
				</Suspense>
			) : (
				<MapSkeleton />
			)}
		</div>
	);
}

function MapSkeleton() {
	return (
		<div className="relative flex size-full items-center justify-center bg-muted">
			<Skeleton className="absolute inset-0 rounded-none" />
			<p className="relative z-10 text-muted-foreground text-sm">
				Memuat peta…
			</p>
		</div>
	);
}
