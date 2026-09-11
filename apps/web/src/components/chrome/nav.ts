import type { SearchQuery } from "@/domain/facets/types";
import { buildCariSearch, createEmptyQuery } from "@/domain/facets/url";
import { popularCampuses, popularCities } from "@/domain/kos/catalog";
import { genderLabels } from "@/domain/kos/labels";
import type { CitySlug, Gender } from "@/domain/kos/types";
import { campusBySlug, parseCitySlug } from "@/domain/seo/locations";

export type SiteNavLink =
	| { label: string; to: "/" }
	| { label: string; to: "/login" }
	| {
			label: string;
			to: "/cari";
			search: SearchQuery;
			image?: string;
			subtitle?: string;
	  }
	| {
			label: string;
			to: "/kota/$city";
			params: { city: CitySlug };
			image?: string;
			subtitle?: string;
	  }
	| {
			label: string;
			to: "/kampus/$slug";
			params: { slug: string };
			image?: string;
			subtitle?: string;
	  }
	| {
			label: string;
			to: "/tipe/$gender";
			params: { gender: Gender };
			image?: string;
			subtitle?: string;
	  };

export type SiteNavSection = {
	id: string;
	label: string;
	items: SiteNavLink[];
};

export type DesktopNavMenu = {
	id: string;
	label: string;
	sections: SiteNavSection[];
};

const jelajahiItems: SiteNavLink[] = [
	{ label: "Semua kos", search: createEmptyQuery(), to: "/cari" },
	{
		label: "Lagi promo",
		search: buildCariSearch({ badges: ["promo"] }),
		to: "/cari",
	},
	{
		label: "Dikelola Ibukos",
		search: buildCariSearch({ badges: ["dikelola"] }),
		to: "/cari",
	},
	{
		label: "Kos andalan",
		search: buildCariSearch({ badges: ["andalan"] }),
		to: "/cari",
	},
];

const tipeItems: SiteNavLink[] = [
	{
		label: `Kos ${genderLabels.putri}`,
		params: { gender: "putri" },
		to: "/tipe/$gender",
	},
	{
		label: `Kos ${genderLabels.putra}`,
		params: { gender: "putra" },
		to: "/tipe/$gender",
	},
	{
		label: `Kos ${genderLabels.campur}`,
		params: { gender: "campur" },
		to: "/tipe/$gender",
	},
];

const kotaItems: SiteNavLink[] = popularCities.flatMap((city) => {
	const slug = parseCitySlug(city.slug);
	if (!slug) {
		return [];
	}
	return [
		{
			label: city.label,
			params: { city: slug },
			to: "/kota/$city",
		},
	];
});

const kampusItems: SiteNavLink[] = popularCampuses.map((campus) => {
	const landing = campusBySlug(campus.slug);
	if (landing && landing.listings.length > 0) {
		return {
			label: campus.label,
			subtitle: campus.subtitle,
			image: campus.image,
			params: { slug: campus.slug },
			to: "/kampus/$slug",
		};
	}
	return {
		label: campus.label,
		subtitle: campus.subtitle,
		image: campus.image,
		search: buildCariSearch(campus.query),
		to: "/cari",
	};
});

export const siteNavSections: SiteNavSection[] = [
	{
		id: "situs",
		items: [
			{ label: "Beranda", to: "/" },
			{ label: "Cari kos", search: createEmptyQuery(), to: "/cari" },
			{ label: "Iklankan kos", to: "/login" },
		],
		label: "Situs",
	},
	{ id: "jelajahi", items: jelajahiItems, label: "Jelajahi" },
	{ id: "kota", items: kotaItems, label: "Kota" },
	{ id: "kampus", items: kampusItems, label: "Kampus" },
];

export const desktopNavMenus: DesktopNavMenu[] = [
	{
		id: "cari",
		label: "Cari",
		sections: [
			{ id: "jelajahi", items: jelajahiItems, label: "Jelajahi" },
			{ id: "tipe", items: tipeItems, label: "Tipe kos" },
		],
	},
	{
		id: "kota",
		label: "Kota",
		sections: [{ id: "kota", items: kotaItems, label: "Kota populer" }],
	},
	{
		id: "kampus",
		label: "Kampus",
		sections: [{ id: "kampus", items: kampusItems, label: "Dekat kampus" }],
	},
];
