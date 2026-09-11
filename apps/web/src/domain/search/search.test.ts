import { describe, expect, test } from "bun:test";

import { buildActiveChips } from "../facets/definitions";
import {
	buildCariSearch,
	createEmptyQuery,
	parseSearchQuery,
	serializeSearchQuery,
} from "../facets/url";
import { mapBounds } from "../geo";
import { getCatalog } from "../kos/catalog";
import { listingCoords } from "../kos/labels";
import { searchListings } from "./run";

describe("parseSearchQuery / serializeSearchQuery", () => {
	test("round-trips gender filter", () => {
		const query = { ...createEmptyQuery(), gender: "putri" as const };
		const serialized = serializeSearchQuery(query);
		expect(serialized).toEqual({ gender: "putri" });
		const parsed = parseSearchQuery(serialized);
		expect(parsed.gender).toBe("putri");
		expect(parsed.sort).toBe("recommended");
	});

	test("round-trips city tile seed", () => {
		const query = { ...createEmptyQuery(), city: "yogyakarta" as const };
		const serialized = serializeSearchQuery(query);
		expect(serialized).toEqual({ city: "yogyakarta" });
		const parsed = parseSearchQuery(serialized);
		expect(parsed.city).toBe("yogyakarta");
	});

	test("omits default sort on serialize", () => {
		const serialized = serializeSearchQuery(createEmptyQuery());
		expect(serialized.sort).toBeUndefined();
	});

	test("buildCariSearch produces navigate-ready search", () => {
		const search = buildCariSearch({ city: "bandung", gender: "campur" });
		expect(search).toEqual({
			...createEmptyQuery(),
			city: "bandung",
			gender: "campur",
		});
	});

	test("keeps facilities from a navigate SearchQuery object", () => {
		const parsed = parseSearchQuery({
			...createEmptyQuery(),
			city: "bandung",
			facilities: ["wifi", "ac"],
		});
		expect(parsed.city).toBe("bandung");
		expect(parsed.facilities).toEqual(["wifi", "ac"]);
	});

	test("fail-soft on garbage params", () => {
		const parsed = parseSearchQuery({
			gender: "invalid",
			sort: "nope",
			price: "abc",
			fasilitas: "wifi,not-a-facility",
			city: "mars",
		});
		expect(parsed.gender).toBeUndefined();
		expect(parsed.sort).toBe("recommended");
		expect(parsed.priceMin).toBeUndefined();
		expect(parsed.priceMax).toBeUndefined();
		expect(parsed.facilities).toEqual(["wifi"]);
		expect(parsed.city).toBeUndefined();
	});

	test("round-trips batas", () => {
		const bounds = mapBounds(-7.81, 110.35, -7.77, 110.39);
		expect(bounds).toEqual({
			south: -7.81,
			west: 110.35,
			north: -7.77,
			east: 110.39,
		});
		const query = { ...createEmptyQuery(), bounds };
		const serialized = serializeSearchQuery(query);
		expect(serialized).toEqual({ batas: "-7.81,110.35,-7.77,110.39" });
		const parsed = parseSearchQuery(serialized);
		expect(parsed.bounds).toEqual({
			south: -7.81,
			west: 110.35,
			north: -7.77,
			east: 110.39,
		});
		expect(parsed.city).toBeUndefined();
	});

	test("garbage batas fail-soft", () => {
		expect(parseSearchQuery({ batas: "nope" }).bounds).toBeUndefined();
		expect(parseSearchQuery({ batas: "1,2,3" }).bounds).toBeUndefined();
		expect(parseSearchQuery({ batas: "1,2,3,foo" }).bounds).toBeUndefined();
		expect(parseSearchQuery({ batas: "7,110,-7,111" }).bounds).toBeUndefined();
	});

	test("bounds XOR drops city", () => {
		const parsed = parseSearchQuery({
			city: "yogyakarta",
			batas: "-7.81,110.35,-7.77,110.39",
		});
		expect(parsed.bounds).toEqual({
			south: -7.81,
			west: 110.35,
			north: -7.77,
			east: 110.39,
		});
		expect(parsed.city).toBeUndefined();
	});

	test("open-ended price serializes without a zero floor", () => {
		const query = { ...createEmptyQuery(), priceMax: 2_000_000 };
		const serialized = serializeSearchQuery(query);
		expect(serialized.price).toBe("-2000000");
		expect(parseSearchQuery(serialized).priceMax).toBe(2_000_000);
		expect(parseSearchQuery(serialized).priceMin).toBeUndefined();
	});

	test("view default split omitted on serialize", () => {
		expect(createEmptyQuery().view).toBe("split");
		expect(serializeSearchQuery(createEmptyQuery()).tampilan).toBeUndefined();
		expect(parseSearchQuery({}).view).toBe("split");
		expect(
			serializeSearchQuery({ ...createEmptyQuery(), view: "peta" }),
		).toEqual({
			tampilan: "peta",
		});
	});
});

describe("buildActiveChips", () => {
	test("price chips use bounded copy instead of infinity", () => {
		const chips = buildActiveChips({
			...createEmptyQuery(),
			priceMin: 0,
			priceMax: 2_000_000,
		});
		const price = chips.find((chip) => chip.facetId === "price");
		expect(price?.label.startsWith("s.d. ")).toBe(true);
		expect(price?.label.includes("∞")).toBe(false);
	});

	test("sort is not a removable chip", () => {
		const chips = buildActiveChips({
			...createEmptyQuery(),
			sort: "price-asc",
		});
		expect(chips.some((chip) => chip.facetId === "sort")).toBe(false);
	});
});

describe("searchListings", () => {
	const catalog = getCatalog();

	test("filters by gender", () => {
		const query = { ...createEmptyQuery(), gender: "putri" as const };
		const result = searchListings(catalog, query);
		expect(result.total).toBeGreaterThan(0);
		expect(result.items.every((item) => item.gender === "putri")).toBe(true);
	});

	test("filters by city from tile seed", () => {
		const query = parseSearchQuery({ city: "yogyakarta" });
		const result = searchListings(catalog, query);
		expect(result.total).toBeGreaterThan(0);
		expect(result.items.every((item) => item.city === "yogyakarta")).toBe(true);
	});

	test("searchListings with bounds includes only pins inside", () => {
		const listing = catalog.find((item) => item.slug === "kos-mawar-ugm");
		expect(listing?.slug).toBe("kos-mawar-ugm");
		if (!listing) {
			return;
		}
		const coords = listingCoords(listing.slug, listing.city);
		const bounds = mapBounds(
			coords.lat - 0.001,
			coords.lng - 0.001,
			coords.lat + 0.001,
			coords.lng + 0.001,
		);
		expect(bounds).toEqual({
			south: coords.lat - 0.001,
			west: coords.lng - 0.001,
			north: coords.lat + 0.001,
			east: coords.lng + 0.001,
		});
		if (!bounds) {
			return;
		}
		const result = searchListings(catalog, { ...createEmptyQuery(), bounds });
		expect(result.items.map((item) => item.slug)).toEqual(["kos-mawar-ugm"]);
	});
});
