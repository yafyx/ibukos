import { listingOverview } from "@/domain/kos/detail-content";
import { cityLabels, formatPriceIdr, genderLabels } from "@/domain/kos/labels";
import type {
	CitySlug,
	Gender,
	KosDetail,
	KosListing,
} from "@/domain/kos/types";
import type { SeoDocument } from "./head";
import {
	campusBySlug,
	cityListings,
	genderCityListings,
	tipeListings,
} from "./locations";
import {
	breadcrumbJsonLd,
	faqJsonLd,
	itemListJsonLd,
	listingJsonLd,
	websiteJsonLd,
} from "./schema";
import { searchIndexPolicy } from "./search-index";
import {
	DEFAULT_OG_IMAGE,
	metaDescription,
	pageTitle,
	SITE_DESCRIPTION,
	siteOrigin,
} from "./site";

export function homeDocument(): SeoDocument {
	const origin = siteOrigin();
	return {
		title: pageTitle("Cari kos putra, putri, campur di Indonesia"),
		description: SITE_DESCRIPTION,
		path: "/",
		jsonLd: [websiteJsonLd(origin), faqJsonLd()],
	};
}

export function searchDocument(
	query: Parameters<typeof searchIndexPolicy>[0],
): SeoDocument {
	const policy = searchIndexPolicy(query);
	return {
		title: policy.title,
		description: policy.description,
		path: policy.path,
		robots: policy.index ? "index, follow" : "noindex, follow",
	};
}

export function listingDocument(listing: KosDetail): SeoDocument {
	const origin = siteOrigin();
	const gender = genderLabels[listing.gender];
	const city = cityLabels[listing.city];
	return {
		title: pageTitle(listing.name, `Kos ${gender} ${city}`),
		description: metaDescription(listingOverview(listing)),
		path: `/kos/${listing.slug}`,
		ogType: "article",
		jsonLd: [
			listingJsonLd(listing, origin),
			breadcrumbJsonLd(origin, [
				{ name: "Beranda", path: "/" },
				{ name: "Cari kos", path: "/cari" },
				{ name: listing.name, path: `/kos/${listing.slug}` },
			]),
		],
	};
}

export function cityDocument(city: CitySlug): SeoDocument | undefined {
	const listings = cityListings(city);
	if (listings.length === 0) {
		return undefined;
	}
	const origin = siteOrigin();
	const label = cityLabels[city];
	const min = minPrice(listings);
	const campuses = unique(listings.map((item) => item.campus).filter(isString));
	const areas = unique(listings.map((item) => item.area));
	const campusBit = campuses.length > 0 ? ` Dekat ${joinId(campuses)}.` : "";
	const areaBit = areas.length > 0 ? ` Area: ${joinId(areas)}.` : "";
	const path = `/kota/${city}`;
	return {
		title: pageTitle(`Kos ${label}`, "Sewa kamar putra, putri, campur"),
		description: metaDescription(
			`${listings.length} kos di ${label}, mulai ${formatPriceIdr(min)}/bulan.${campusBit}${areaBit} Bandingkan dan sewa di Ibukos.`,
		),
		path,
		jsonLd: [
			itemListJsonLd(origin, listings, `Kos di ${label}`, path),
			breadcrumbJsonLd(origin, [
				{ name: "Beranda", path: "/" },
				{ name: `Kos ${label}`, path },
			]),
		],
	};
}

export function genderCityDocument(
	city: CitySlug,
	gender: Gender,
): SeoDocument | undefined {
	const listings = genderCityListings(city, gender);
	if (listings.length === 0) {
		return undefined;
	}
	const origin = siteOrigin();
	const label = cityLabels[city];
	const genderLabel = genderLabels[gender];
	const min = minPrice(listings);
	const path = `/kota/${city}/${gender}`;
	return {
		title: pageTitle(`Kos ${genderLabel} ${label}`),
		description: metaDescription(
			`${listings.length} kos ${genderLabel.toLowerCase()} di ${label}, mulai ${formatPriceIdr(min)}/bulan. Lihat fasilitas, sisa kamar, lalu sewa di Ibukos.`,
		),
		path,
		jsonLd: [
			itemListJsonLd(origin, listings, `Kos ${genderLabel} di ${label}`, path),
			breadcrumbJsonLd(origin, [
				{ name: "Beranda", path: "/" },
				{ name: `Kos ${label}`, path: `/kota/${city}` },
				{ name: `Kos ${genderLabel}`, path },
			]),
		],
	};
}

export function campusDocument(slug: string): SeoDocument | undefined {
	const campus = campusBySlug(slug);
	if (!campus || campus.listings.length === 0) {
		return undefined;
	}
	const origin = siteOrigin();
	const min = minPrice(campus.listings);
	const path = `/kampus/${campus.slug}`;
	const crumbs = [
		{ name: "Beranda", path: "/" },
		...(campus.city
			? [{ name: campus.cityLabel, path: `/kota/${campus.city}` }]
			: []),
		{ name: campus.label, path },
	];
	return {
		title: pageTitle(`Kos dekat ${campus.label}`, campus.cityLabel),
		description: metaDescription(
			`${campus.listings.length} kos dekat ${campus.label}, ${campus.cityLabel}, mulai ${formatPriceIdr(min)}/bulan. Cari kamar dan sewa di Ibukos.`,
		),
		path,
		jsonLd: [
			itemListJsonLd(
				origin,
				campus.listings,
				`Kos dekat ${campus.label}`,
				path,
			),
			breadcrumbJsonLd(origin, crumbs),
		],
	};
}

export function tipeDocument(gender: Gender): SeoDocument {
	const listings = tipeListings(gender);
	const origin = siteOrigin();
	const genderLabel = genderLabels[gender];
	const cities = unique(listings.map((item) => cityLabels[item.city]));
	const path = `/tipe/${gender}`;
	return {
		title: pageTitle(`Kos ${genderLabel}`),
		description: metaDescription(
			`Cari kos ${genderLabel.toLowerCase()} di ${joinId(cities.length > 0 ? cities : ["Indonesia"])}. Bandingkan harga dan fasilitas di Ibukos.`,
		),
		path,
		jsonLd: [
			itemListJsonLd(origin, listings, `Kos ${genderLabel}`, path),
			breadcrumbJsonLd(origin, [
				{ name: "Beranda", path: "/" },
				{ name: `Kos ${genderLabel}`, path },
			]),
		],
	};
}

export function privateDocument(title: string, path: string): SeoDocument {
	return {
		title: pageTitle(title),
		description: metaDescription(`${title} Ibukos.`),
		path,
		image: DEFAULT_OG_IMAGE,
		robots: "noindex, nofollow",
	};
}

export function listingAlt(listing: KosListing): string {
	return `${listing.name}, kos ${genderLabels[listing.gender].toLowerCase()} di ${listing.area}, ${cityLabels[listing.city]}`;
}

function minPrice(listings: readonly KosListing[]): number {
	return Math.min(
		...listings.map((item) => item.pricePromo ?? item.priceMonthly),
	);
}

function unique(values: string[]): string[] {
	return [...new Set(values)];
}

function isString(value: string | undefined): value is string {
	return typeof value === "string" && value.length > 0;
}

function joinId(parts: string[]): string {
	if (parts.length <= 1) {
		return parts[0] ?? "";
	}
	if (parts.length === 2) {
		return `${parts[0]} dan ${parts[1]}`;
	}
	return `${parts.slice(0, -1).join(", ")}, dan ${parts[parts.length - 1]}`;
}
