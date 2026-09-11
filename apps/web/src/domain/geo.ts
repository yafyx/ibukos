import { cityCenter, listingCoords } from "./kos/labels";
import type { CitySlug, KosListing } from "./kos/types";

export type LatLng = {
	readonly lat: number;
	readonly lng: number;
};

/** south < north, west < east, finite; Indonesia catalog has no antimeridian wrap. */
export type MapBounds = {
	readonly south: number;
	readonly west: number;
	readonly north: number;
	readonly east: number;
};

export type CariView = "daftar" | "split" | "peta";

export type GeoFit =
	| { kind: "area"; bounds: MapBounds }
	| { kind: "city"; city: CitySlug }
	| { kind: "markers"; coords: readonly LatLng[] };

export type PlacedListing = {
	listing: KosListing;
	coords: LatLng;
};

export type GeoFitToken = string;

/** Half-span around cityCenter so the box is ~0.08° on a side. */
const CITY_BOX_HALF = 0.04;

const CARI_VIEWS: readonly CariView[] = ["daftar", "split", "peta"];

export function latLng(lat: number, lng: number): LatLng | undefined {
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return undefined;
	}
	return { lat, lng };
}

export function mapBounds(
	south: number,
	west: number,
	north: number,
	east: number,
): MapBounds | undefined {
	if (![south, west, north, east].every(Number.isFinite)) {
		return undefined;
	}
	if (!(south < north) || !(west < east)) {
		return undefined;
	}
	return { south, west, north, east };
}

export function parseCariView(raw: unknown): CariView {
	return typeof raw === "string" && CARI_VIEWS.includes(raw as CariView)
		? (raw as CariView)
		: "split";
}

export function parseBounds(raw: unknown): MapBounds | undefined {
	if (raw && typeof raw === "object") {
		const record = raw as Record<string, unknown>;
		if (
			typeof record.south === "number" &&
			typeof record.west === "number" &&
			typeof record.north === "number" &&
			typeof record.east === "number"
		) {
			return mapBounds(record.south, record.west, record.north, record.east);
		}
	}
	if (typeof raw !== "string") {
		return undefined;
	}
	const parts = raw.split(",").map((part) => part.trim());
	if (parts.length !== 4) {
		return undefined;
	}
	const nums = parts.map((part) => Number(part));
	return mapBounds(
		nums[0] ?? Number.NaN,
		nums[1] ?? Number.NaN,
		nums[2] ?? Number.NaN,
		nums[3] ?? Number.NaN,
	);
}

export function serializeBounds(bounds: MapBounds): string {
	return `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
}

export function boundsCenter(bounds: MapBounds): LatLng {
	return {
		lat: (bounds.south + bounds.north) / 2,
		lng: (bounds.west + bounds.east) / 2,
	};
}

export function boundsContain(bounds: MapBounds, point: LatLng): boolean {
	return (
		point.lat >= bounds.south &&
		point.lat <= bounds.north &&
		point.lng >= bounds.west &&
		point.lng <= bounds.east
	);
}

export function boundsOverlap(a: MapBounds, b: MapBounds): boolean {
	return (
		a.south < b.north && a.north > b.south && a.west < b.east && a.east > b.west
	);
}

export function boundsDrifted(home: MapBounds, live: MapBounds): boolean {
	const latSpan = Math.max(home.north - home.south, 0.002);
	const lngSpan = Math.max(home.east - home.west, 0.002);
	const ratio = 0.08;
	return (
		Math.abs(live.south - home.south) > latSpan * ratio ||
		Math.abs(live.north - home.north) > latSpan * ratio ||
		Math.abs(live.west - home.west) > lngSpan * ratio ||
		Math.abs(live.east - home.east) > lngSpan * ratio
	);
}

export function cityBounds(city: CitySlug): MapBounds {
	const center = cityCenter[city];
	const bounds = mapBounds(
		center.lat - CITY_BOX_HALF,
		center.lng - CITY_BOX_HALF,
		center.lat + CITY_BOX_HALF,
		center.lng + CITY_BOX_HALF,
	);
	if (!bounds) {
		throw new Error(`cityBounds(${city}) produced an empty box`);
	}
	return bounds;
}

export function placeListing(listing: KosListing): PlacedListing {
	return { listing, coords: listingCoords(listing.slug, listing.city) };
}

export function placeListings(
	listings: readonly KosListing[],
): PlacedListing[] {
	return listings.map(placeListing);
}

export function mapFitFromQuery(
	query: { bounds?: MapBounds; city?: CitySlug },
	placed: readonly PlacedListing[],
): GeoFit {
	if (query.bounds) {
		return { kind: "area", bounds: query.bounds };
	}
	if (query.city) {
		return { kind: "city", city: query.city };
	}
	const coords = placed.map((item) => item.coords);
	if (coords.length > 0) {
		return { kind: "markers", coords };
	}
	return { kind: "city", city: "yogyakarta" };
}

export function geoFitToken(fit: GeoFit): GeoFitToken {
	switch (fit.kind) {
		case "area":
			return `area:${serializeBounds(fit.bounds)}`;
		case "city":
			return `city:${fit.city}`;
		case "markers":
			return `markers:${fit.coords.map((point) => `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`).join(";")}`;
	}
}

export function commitMapArea<
	Q extends { city?: CitySlug; bounds?: MapBounds },
>(query: Q, live: MapBounds): Q {
	const city =
		query.city && !boundsOverlap(live, cityBounds(query.city))
			? undefined
			: query.city;
	return { ...query, bounds: live, city };
}

export function withCariView<Q extends { view: CariView }>(
	query: Q,
	view: CariView,
): Q {
	return { ...query, view };
}

export function leafletBoundsToMapBounds(bounds: {
	getSouth(): number;
	getWest(): number;
	getNorth(): number;
	getEast(): number;
}): MapBounds | undefined {
	return mapBounds(
		bounds.getSouth(),
		bounds.getWest(),
		bounds.getNorth(),
		bounds.getEast(),
	);
}
