"use client";

import { Button } from "@ibukos/ui/components/button";
import L from "leaflet";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	MapContainer,
	Marker,
	TileLayer,
	useMap,
	useMapEvents,
} from "react-leaflet";

import { PriceLegend } from "@/components/search/price-legend";
import type { Highlight, HighlightEvent } from "@/domain/cari/highlight";
import {
	boundsDrifted,
	cityBounds,
	type GeoFit,
	type GeoFitToken,
	geoFitToken,
	leafletBoundsToMapBounds,
	type MapBounds,
	type PlacedListing,
} from "@/domain/geo";
import { pressable, viewEnter } from "@/lib/motion";

import { pinHighlightHandlers, pinIcon } from "./price-pin";

import "leaflet/dist/leaflet.css";

type CameraSession =
	| { kind: "synced"; token: GeoFitToken; home: MapBounds }
	| {
			kind: "drifted";
			token: GeoFitToken;
			home: MapBounds;
			live: MapBounds;
	  };

export type MapCanvasProps = {
	items: readonly PlacedListing[];
	highlight: Highlight;
	fit: GeoFit;
	visible: boolean;
	total: number;
	onHighlightEvent: (event: HighlightEvent) => void;
	onCommitArea: (bounds: MapBounds) => void;
};

export function MapCanvas({
	items,
	highlight,
	fit,
	visible,
	total,
	onHighlightEvent,
	onCommitArea,
}: MapCanvasProps) {
	const [session, setSession] = useState<CameraSession | null>(null);

	return (
		<div className="relative size-full min-h-0">
			<MapContainer
				attributionControl
				center={[-7.7956, 110.3695]}
				className="absolute inset-0 z-0 size-full bg-muted"
				scrollWheelZoom
				zoom={12}
				zoomControl={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<FitAndDrift fit={fit} onSession={setSession} visible={visible} />
				{items.map((placed) => (
					<Marker
						eventHandlers={pinHighlightHandlers(
							placed.listing.slug,
							onHighlightEvent,
						)}
						icon={pinIcon(placed, highlight)}
						key={placed.listing.slug}
						position={[placed.coords.lat, placed.coords.lng]}
						zIndexOffset={
							highlight.kind !== "none" &&
							highlight.slug === placed.listing.slug
								? 800
								: 0
						}
					/>
				))}
			</MapContainer>
			{session?.kind === "drifted" ? (
				<div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
					<Button
						className={`${pressable} ${viewEnter} pointer-events-auto shadow-md`}
						onClick={() => onCommitArea(session.live)}
						size="sm"
						type="button"
					>
						Cari di area ini
					</Button>
				</div>
			) : null}
			<div className="pointer-events-none absolute start-4 bottom-24 z-10 lg:bottom-4">
				<div className="pointer-events-auto">
					<PriceLegend total={total} variant="overlay" />
				</div>
			</div>
		</div>
	);
}

function leafletBoundsFromFit(fit: GeoFit): L.LatLngBounds {
	if (fit.kind === "area") {
		return L.latLngBounds(
			[fit.bounds.south, fit.bounds.west],
			[fit.bounds.north, fit.bounds.east],
		);
	}
	if (fit.kind === "city") {
		const bounds = cityBounds(fit.city);
		return L.latLngBounds(
			[bounds.south, bounds.west],
			[bounds.north, bounds.east],
		);
	}
	return L.latLngBounds(
		fit.coords.map((point) => [point.lat, point.lng] as [number, number]),
	);
}

function FitAndDrift({
	fit,
	visible,
	onSession,
}: {
	fit: GeoFit;
	visible: boolean;
	onSession: (session: CameraSession) => void;
}) {
	const map = useMap();
	const token = geoFitToken(fit);
	const ignoreMove = useRef(false);
	const sessionRef = useRef<CameraSession | null>(null);

	useEffect(() => {
		map.attributionControl.setPrefix(false);
		const container = map.getContainer();
		const island = container.closest(".cari-map-island");
		const column = island?.parentElement;
		const observer = new ResizeObserver(() => {
			map.invalidateSize({ animate: false });
		});
		observer.observe(container);
		if (island instanceof HTMLElement) {
			observer.observe(island);
		}
		if (column instanceof HTMLElement) {
			observer.observe(column);
		}
		return () => observer.disconnect();
	}, [map]);

	useLayoutEffect(() => {
		if (!visible) {
			return;
		}
		map.invalidateSize({ animate: false });
	}, [map, visible, token]);

	useEffect(() => {
		ignoreMove.current = true;
		map.fitBounds(leafletBoundsFromFit(fit), {
			animate: false,
			maxZoom: 15,
			padding: [28, 28],
		});
		map.once("moveend", () => {
			const home = leafletBoundsToMapBounds(map.getBounds());
			ignoreMove.current = false;
			if (!home) {
				return;
			}
			const next: CameraSession = { kind: "synced", token, home };
			sessionRef.current = next;
			onSession(next);
		});
	}, [fit, map, onSession, token]);

	useMapEvents({
		moveend() {
			if (ignoreMove.current) {
				return;
			}
			const home = sessionRef.current?.home;
			if (!home) {
				return;
			}
			const live = leafletBoundsToMapBounds(map.getBounds());
			if (!live) {
				return;
			}
			const currentToken = sessionRef.current?.token ?? token;
			const next: CameraSession = boundsDrifted(home, live)
				? { kind: "drifted", token: currentToken, home, live }
				: { kind: "synced", token: currentToken, home };
			sessionRef.current = next;
			onSession(next);
		},
	});

	return null;
}

export default MapCanvas;
