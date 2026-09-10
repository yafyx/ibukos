import {
	badgeLabels,
	cityLabels,
	durationLabels,
	facilityLabels,
	genderLabels,
	ruleLabels,
	sortLabels,
} from "../kos/labels";
import type { BadgeId, CitySlug, Duration, FacilityId, Gender, KosListing, RuleId, SortKey } from "../kos/types";
import type { FacetId, SearchQuery } from "./types";

const GENDERS: Gender[] = ["putra", "putri", "campur"];
const DURATIONS: Duration[] = ["mingguan", "bulanan", "3bulan", "6bulan", "tahunan"];
const SORT_KEYS: SortKey[] = ["recommended", "price-asc", "price-desc"];
const CITIES: CitySlug[] = [
	"yogyakarta",
	"jakarta",
	"bandung",
	"surabaya",
	"malang",
	"semarang",
	"medan",
];
const FACILITIES: FacilityId[] = [
	"km-dalam",
	"wifi",
	"ac",
	"kasur",
	"kloset-duduk",
	"parkir-motor",
	"parkir-mobil",
	"dapur",
	"listrik",
];
const RULES: RuleId[] = ["akses-24jam", "pasutri", "hewan", "karyawan"];
const BADGES: BadgeId[] = ["promo", "dikelola", "andalan"];

function parseCommaList<T extends string>(raw: string | undefined, allowed: readonly T[]): T[] {
	if (!raw) {
		return [];
	}
	return raw
		.split(",")
		.map((part) => part.trim())
		.filter((part): part is T => allowed.includes(part as T));
}

function parsePriceRange(raw: unknown): { priceMin?: number; priceMax?: number } {
	if (typeof raw !== "string" || !raw.includes("-")) {
		return {};
	}
	const [minRaw, maxRaw] = raw.split("-", 2);
	const priceMin = Number.parseInt(minRaw, 10);
	const priceMax = Number.parseInt(maxRaw, 10);
	return {
		priceMin: Number.isFinite(priceMin) ? priceMin : undefined,
		priceMax: Number.isFinite(priceMax) ? priceMax : undefined,
	};
}

export function createEmptyQuery(): SearchQuery {
	return {
		facilities: [],
		rules: [],
		availableOnly: false,
		badges: [],
		sort: "recommended",
	};
}

export function applyFacet<K extends FacetId>(
	query: SearchQuery,
	facetId: K,
	value: unknown,
): SearchQuery {
	switch (facetId) {
		case "q":
			return { ...query, q: typeof value === "string" && value ? value : undefined };
		case "city":
			return {
				...query,
				city: CITIES.includes(value as CitySlug) ? (value as CitySlug) : undefined,
			};
		case "gender":
			return {
				...query,
				gender: GENDERS.includes(value as Gender) ? (value as Gender) : undefined,
			};
		case "duration":
			return {
				...query,
				duration: DURATIONS.includes(value as Duration) ? (value as Duration) : undefined,
			};
		case "price": {
			const range =
				typeof value === "object" && value !== null
					? (value as { priceMin?: number; priceMax?: number })
					: parsePriceRange(value);
			return { ...query, ...range };
		}
		case "facilities":
			return {
				...query,
				facilities: Array.isArray(value)
					? value.filter((item): item is FacilityId => FACILITIES.includes(item as FacilityId))
					: parseCommaList(String(value ?? ""), FACILITIES),
			};
		case "rules":
			return {
				...query,
				rules: Array.isArray(value)
					? value.filter((item): item is RuleId => RULES.includes(item as RuleId))
					: parseCommaList(String(value ?? ""), RULES),
			};
		case "available":
			return { ...query, availableOnly: value === true || value === "1" || value === 1 };
		case "badges":
			return {
				...query,
				badges: Array.isArray(value)
					? value.filter((item): item is BadgeId => BADGES.includes(item as BadgeId))
					: parseCommaList(String(value ?? ""), BADGES),
			};
		case "sort":
			return {
				...query,
				sort: SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : "recommended",
			};
		default:
			return query;
	}
}

export function clearFacet(query: SearchQuery, facetId: FacetId): SearchQuery {
	switch (facetId) {
		case "q":
			return { ...query, q: undefined };
		case "city":
			return { ...query, city: undefined };
		case "gender":
			return { ...query, gender: undefined };
		case "duration":
			return { ...query, duration: undefined };
		case "price":
			return { ...query, priceMin: undefined, priceMax: undefined };
		case "facilities":
			return { ...query, facilities: [] };
		case "rules":
			return { ...query, rules: [] };
		case "available":
			return { ...query, availableOnly: false };
		case "badges":
			return { ...query, badges: [] };
		case "sort":
			return { ...query, sort: "recommended" };
		default:
			return query;
	}
}

export function buildCariSearch(query: Partial<SearchQuery>): SearchQuery {
	return { ...createEmptyQuery(), ...query };
}

function isNavigateSearchQuery(raw: Record<string, unknown>): boolean {
	return (
		Array.isArray(raw.facilities) ||
		Array.isArray(raw.rules) ||
		Array.isArray(raw.badges) ||
		typeof raw.availableOnly === "boolean" ||
		typeof raw.priceMin === "number" ||
		typeof raw.priceMax === "number"
	);
}

export function parseSearchQuery(raw: Record<string, unknown>): SearchQuery {
	if (isNavigateSearchQuery(raw)) {
		return buildCariSearch({
			q: typeof raw.q === "string" && raw.q.trim() ? raw.q.trim() : undefined,
			city: typeof raw.city === "string" && CITIES.includes(raw.city as CitySlug)
				? (raw.city as CitySlug)
				: undefined,
			gender:
				typeof raw.gender === "string" && GENDERS.includes(raw.gender as Gender)
					? (raw.gender as Gender)
					: undefined,
			duration:
				typeof raw.duration === "string" && DURATIONS.includes(raw.duration as Duration)
					? (raw.duration as Duration)
					: undefined,
			priceMin: typeof raw.priceMin === "number" ? raw.priceMin : undefined,
			priceMax: typeof raw.priceMax === "number" ? raw.priceMax : undefined,
			facilities: Array.isArray(raw.facilities)
				? raw.facilities.filter((item): item is FacilityId => FACILITIES.includes(item as FacilityId))
				: [],
			rules: Array.isArray(raw.rules)
				? raw.rules.filter((item): item is RuleId => RULES.includes(item as RuleId))
				: [],
			availableOnly: raw.availableOnly === true,
			badges: Array.isArray(raw.badges)
				? raw.badges.filter((item): item is BadgeId => BADGES.includes(item as BadgeId))
				: [],
			sort: typeof raw.sort === "string" && SORT_KEYS.includes(raw.sort as SortKey)
				? (raw.sort as SortKey)
				: "recommended",
		});
	}

	const query = createEmptyQuery();

	if (typeof raw.q === "string" && raw.q.trim()) {
		query.q = raw.q.trim();
	}

	if (typeof raw.city === "string" && CITIES.includes(raw.city as CitySlug)) {
		query.city = raw.city as CitySlug;
	}

	if (typeof raw.gender === "string" && GENDERS.includes(raw.gender as Gender)) {
		query.gender = raw.gender as Gender;
	}

	if (typeof raw.duration === "string" && DURATIONS.includes(raw.duration as Duration)) {
		query.duration = raw.duration as Duration;
	}

	const priceRange = parsePriceRange(raw.price);
	query.priceMin = priceRange.priceMin;
	query.priceMax = priceRange.priceMax;

	if (typeof raw.fasilitas === "string") {
		query.facilities = parseCommaList(raw.fasilitas, FACILITIES);
	}

	if (typeof raw.aturan === "string") {
		query.rules = parseCommaList(raw.aturan, RULES);
	}

	if (raw.sisa === "1" || raw.sisa === 1) {
		query.availableOnly = true;
	}

	if (typeof raw.badge === "string") {
		query.badges = parseCommaList(raw.badge, BADGES);
	}

	if (typeof raw.sort === "string" && SORT_KEYS.includes(raw.sort as SortKey)) {
		query.sort = raw.sort as SortKey;
	}

	return query;
}

export function serializeSearchQuery(query: SearchQuery): Record<string, string | undefined> {
	const params: Record<string, string | undefined> = {};

	if (query.q) {
		params.q = query.q;
	}
	if (query.city) {
		params.city = query.city;
	}
	if (query.gender) {
		params.gender = query.gender;
	}
	if (query.duration) {
		params.duration = query.duration;
	}
	if (query.priceMin !== undefined || query.priceMax !== undefined) {
		const min = query.priceMin ?? "";
		const max = query.priceMax ?? "";
		params.price = `${min}-${max}`;
	}
	if (query.facilities.length > 0) {
		params.fasilitas = query.facilities.join(",");
	}
	if (query.rules.length > 0) {
		params.aturan = query.rules.join(",");
	}
	if (query.availableOnly) {
		params.sisa = "1";
	}
	if (query.badges.length > 0) {
		params.badge = query.badges.join(",");
	}
	if (query.sort !== "recommended") {
		params.sort = query.sort;
	}

	return params;
}

export function listingMatchesQuery(listing: KosListing, query: SearchQuery): boolean {
	if (query.q) {
		const needle = query.q.toLowerCase();
		const haystack = [listing.name, listing.area, listing.city, listing.campus ?? ""]
			.join(" ")
			.toLowerCase();
		if (!haystack.includes(needle)) {
			return false;
		}
	}

	if (query.city && listing.city !== query.city) {
		return false;
	}

	if (query.gender && listing.gender !== query.gender) {
		return false;
	}

	if (query.duration && !listing.durations.includes(query.duration)) {
		return false;
	}

	const price = listing.pricePromo ?? listing.priceMonthly;
	if (query.priceMin !== undefined && price < query.priceMin) {
		return false;
	}
	if (query.priceMax !== undefined && price > query.priceMax) {
		return false;
	}

	if (query.facilities.length > 0 && !query.facilities.every((f) => listing.facilities.includes(f))) {
		return false;
	}

	if (query.rules.length > 0 && !query.rules.every((r) => listing.rules.includes(r))) {
		return false;
	}

	if (query.availableOnly && listing.roomsAvailable <= 0) {
		return false;
	}

	if (query.badges.length > 0 && !query.badges.every((b) => listing.badges.includes(b))) {
		return false;
	}

	return true;
}

export function sortListings(
	listings: KosListing[],
	sort: SortKey,
): KosListing[] {
	const copy = [...listings];
	switch (sort) {
		case "price-asc":
			return copy.sort(
				(a, b) =>
					(a.pricePromo ?? a.priceMonthly) - (b.pricePromo ?? b.priceMonthly),
			);
		case "price-desc":
			return copy.sort(
				(a, b) =>
					(b.pricePromo ?? b.priceMonthly) - (a.pricePromo ?? a.priceMonthly),
			);
		default:
			return copy.sort((a, b) => {
				const scoreA =
					(a.rating ?? 0) * 10 +
					(a.badges.includes("andalan") ? 5 : 0) +
					(a.badges.includes("promo") ? 2 : 0);
				const scoreB =
					(b.rating ?? 0) * 10 +
					(b.badges.includes("andalan") ? 5 : 0) +
					(b.badges.includes("promo") ? 2 : 0);
				return scoreB - scoreA;
			});
	}
}

export function buildActiveChips(query: SearchQuery): import("./types").ActiveChip[] {
	const chips: import("./types").ActiveChip[] = [];

	if (query.q) {
		chips.push({
			facetId: "q",
			label: `"${query.q}"`,
			next: clearFacet(query, "q"),
		});
	}

	if (query.city) {
		chips.push({
			facetId: "city",
			label: cityLabels[query.city],
			next: clearFacet(query, "city"),
		});
	}

	if (query.gender) {
		chips.push({
			facetId: "gender",
			label: genderLabels[query.gender],
			next: clearFacet(query, "gender"),
		});
	}

	if (query.duration) {
		chips.push({
			facetId: "duration",
			label: durationLabels[query.duration],
			next: clearFacet(query, "duration"),
		});
	}

	if (query.priceMin !== undefined || query.priceMax !== undefined) {
		const min = query.priceMin ?? 0;
		const max = query.priceMax ?? "∞";
		chips.push({
			facetId: "price",
			label: `Rp ${min.toLocaleString("id-ID")} – ${max === "∞" ? "∞" : `Rp ${max.toLocaleString("id-ID")}`}`,
			next: clearFacet(query, "price"),
		});
	}

	for (const facility of query.facilities) {
		chips.push({
			facetId: "facilities",
			label: facilityLabels[facility],
			next: {
				...query,
				facilities: query.facilities.filter((f) => f !== facility),
			},
		});
	}

	for (const rule of query.rules) {
		chips.push({
			facetId: "rules",
			label: ruleLabels[rule],
			next: {
				...query,
				rules: query.rules.filter((r) => r !== rule),
			},
		});
	}

	if (query.availableOnly) {
		chips.push({
			facetId: "available",
			label: "Ada kamar",
			next: clearFacet(query, "available"),
		});
	}

	for (const badge of query.badges) {
		chips.push({
			facetId: "badges",
			label: badgeLabels[badge],
			next: {
				...query,
				badges: query.badges.filter((b) => b !== badge),
			},
		});
	}

	if (query.sort !== "recommended") {
		chips.push({
			facetId: "sort",
			label: sortLabels[query.sort],
			next: clearFacet(query, "sort"),
		});
	}

	return chips;
}

export {
	CITIES,
	DURATIONS,
	FACILITIES,
	GENDERS,
	RULES,
	SORT_KEYS,
};
