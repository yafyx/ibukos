import { describe, expect, test } from "bun:test";

import { createEmptyQuery } from "../facets/url";
import { getCatalog } from "../kos/catalog";
import { listingDocument } from "./pages";
import { listingJsonLd } from "./schema";
import { searchIndexPolicy } from "./search-index";
import { ogImagePath, pageTitle } from "./site";
import { robotsTxt, sitemapEntries } from "./sitemap";

describe("ogImagePath", () => {
	test("maps home to /og and listing paths under /og", () => {
		expect(ogImagePath("/")).toBe("/og");
		expect(ogImagePath("/cari")).toBe("/og/cari");
		expect(ogImagePath("/kos/kos-mawar-ugm")).toBe("/og/kos/kos-mawar-ugm");
		expect(ogImagePath("/kota/yogyakarta?unused=1")).toBe(
			"/og/kota/yogyakarta",
		);
		expect(ogImagePath("/tipe/putri")).toBe("/og/tipe/putri");
	});
});

describe("searchIndexPolicy", () => {
	test("city-only search canonicalizes to the city landing and is not indexed", () => {
		const policy = searchIndexPolicy({
			...createEmptyQuery(),
			city: "yogyakarta",
		});
		expect(policy.path).toBe("/kota/yogyakarta");
		expect(policy.index).toBe(false);
	});

	test("bare search stays on /cari and is indexed", () => {
		const policy = searchIndexPolicy(createEmptyQuery());
		expect(policy.path).toBe("/cari");
		expect(policy.index).toBe(true);
	});

	test("facility filters stay on /cari and are not indexed", () => {
		const policy = searchIndexPolicy({
			...createEmptyQuery(),
			city: "yogyakarta",
			facilities: ["wifi"],
		});
		expect(policy.path).toBe("/cari?city=yogyakarta&fasilitas=wifi");
		expect(policy.index).toBe(false);
	});
});

describe("sitemap and robots", () => {
	test("includes home, city landings, and every catalog listing", () => {
		const paths = sitemapEntries().map((entry) => entry.path);
		expect(paths[0]).toBe("/");
		expect(paths).toContain("/kota/yogyakarta");
		expect(paths).toContain("/kampus/ugm");
		expect(paths).toContain("/tipe/putri");
		for (const listing of getCatalog()) {
			expect(paths).toContain(`/kos/${listing.slug}`);
		}
	});

	test("blocks account and API paths and points at sitemap.xml", () => {
		const body = robotsTxt("https://ibukos.example/robots.txt");
		expect(body).toContain("Disallow: /login");
		expect(body).toContain("Disallow: /dashboard");
		expect(body).toContain("Disallow: /api/");
		expect(body).toContain("Sitemap: https://ibukos.example/sitemap.xml");
	});
});

describe("listing SEO", () => {
	test("title names the kos, gender, and city", () => {
		const listing = getCatalog().find((item) => item.slug === "kos-mawar-ugm");
		expect(listing).toBeDefined();
		if (!listing) {
			return;
		}
		const document = listingDocument(listing);
		expect(document.title).toBe(
			pageTitle("Kos Mawar UGM", "Kos Putri Yogyakarta"),
		);
		expect(document.path).toBe("/kos/kos-mawar-ugm");
		expect(document.ogType).toBe("article");
	});

	test("JSON-LD offer uses IDR and the promo price when present", () => {
		const listing = getCatalog().find((item) => item.slug === "kos-mawar-ugm");
		expect(listing).toBeDefined();
		if (!listing) {
			return;
		}
		const jsonLd = listingJsonLd(listing, "https://ibukos.example");
		expect(jsonLd["@type"]).toBe("Apartment");
		expect(jsonLd.url).toBe("https://ibukos.example/kos/kos-mawar-ugm");
		const offers = jsonLd.offers;
		expect(offers).toBeDefined();
		if (!offers || typeof offers !== "object" || Array.isArray(offers)) {
			throw new Error("expected offers object");
		}
		expect(offers).toMatchObject({
			price: 750_000,
			priceCurrency: "IDR",
		});
	});
});
