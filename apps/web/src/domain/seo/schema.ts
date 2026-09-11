import { homeFeatures } from "@/domain/kos/home-content";
import { facilityLabels, genderLabels } from "@/domain/kos/labels";
import type { KosDetail, KosListing } from "@/domain/kos/types";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "./site";

export type JsonLd = Record<string, unknown>;

export function jsonLdScript(data: JsonLd | JsonLd[]): {
	type: string;
	children: string;
} {
	return {
		type: "application/ld+json",
		children: JSON.stringify(data).replace(/</g, "\\u003c"),
	};
}

export function organizationJsonLd(origin: string): JsonLd {
	const url = absoluteUrl("/", origin);
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": `${url}#organization`,
		name: SITE_NAME,
		url,
		logo: absoluteUrl("/brand/ibukos-ibu.png", origin),
		description: SITE_DESCRIPTION,
	};
}

export function websiteJsonLd(origin: string): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SITE_NAME,
		alternateName: SITE_TAGLINE,
		url: absoluteUrl("/", origin),
		inLanguage: "id-ID",
		description: SITE_DESCRIPTION,
		publisher: { "@id": `${absoluteUrl("/", origin)}#organization` },
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${absoluteUrl("/cari", origin)}?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

export function faqJsonLd(): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: homeFeatures.map((feature) => ({
			"@type": "Question",
			name: feature.title,
			acceptedAnswer: {
				"@type": "Answer",
				text: feature.description,
			},
		})),
	};
}

export function breadcrumbJsonLd(
	origin: string,
	crumbs: readonly { name: string; path: string }[],
): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			item: absoluteUrl(crumb.path, origin),
		})),
	};
}

export function listingJsonLd(listing: KosDetail, origin: string): JsonLd {
	const url = absoluteUrl(`/kos/${listing.slug}`, origin);
	const price = listing.pricePromo ?? listing.priceMonthly;
	return {
		"@context": "https://schema.org",
		"@type": "Apartment",
		name: listing.name,
		description: listing.description,
		url,
		image: listing.photos,
		address: {
			"@type": "PostalAddress",
			streetAddress: listing.address,
			addressLocality: listing.area,
			addressRegion: listing.city,
			addressCountry: "ID",
		},
		numberOfRooms: listing.roomsAvailable,
		amenityFeature: listing.facilities.map((facility) => ({
			"@type": "LocationFeatureSpecification",
			name: facilityLabels[facility],
			value: true,
		})),
		additionalProperty: [
			{
				"@type": "PropertyValue",
				name: "Tipe kos",
				value: genderLabels[listing.gender],
			},
		],
		offers: {
			"@type": "Offer",
			url,
			price,
			priceCurrency: "IDR",
			availability:
				listing.roomsAvailable > 0
					? "https://schema.org/InStock"
					: "https://schema.org/SoldOut",
			unitText: "bulan",
		},
	};
}

export function itemListJsonLd(
	origin: string,
	listings: readonly KosListing[],
	name: string,
	path: string,
): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name,
		url: absoluteUrl(path, origin),
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: listings.length,
			itemListElement: listings.map((listing, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: absoluteUrl(`/kos/${listing.slug}`, origin),
				name: listing.name,
			})),
		},
	};
}
