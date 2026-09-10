import { describe, expect, test } from "bun:test";

import {
	buildCariSearch,
	createEmptyQuery,
	parseSearchQuery,
	serializeSearchQuery,
} from "../facets/url";
import { getCatalog } from "../kos/catalog";
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
});
