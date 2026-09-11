import { describe, expect, test } from "bun:test";

import { getPromoListingsByCity, popularCities } from "./catalog";
import { cityLabels } from "./labels";

describe("getPromoListingsByCity", () => {
	test("groups promo listings in popular-city order", () => {
		const groups = getPromoListingsByCity();
		const groupedCities = groups.map((group) => group.city);
		const popularCitySlugs = popularCities
			.map((tile) => tile.slug)
			.filter((slug) => slug in cityLabels);

		expect(groupedCities).toEqual(
			popularCitySlugs.filter((slug) => groupedCities.includes(slug)),
		);
		expect(groupedCities.length).toBeGreaterThan(1);

		for (const group of groups) {
			expect(group.listings.length).toBeGreaterThan(0);
			expect(
				group.listings.every((listing) => listing.city === group.city),
			).toBe(true);
			expect(
				group.listings.every(
					(listing) =>
						listing.badges.includes("promo") ||
						listing.pricePromo !== undefined,
				),
			).toBe(true);
		}
	});
});
