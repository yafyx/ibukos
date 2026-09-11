import { CITIES, GENDERS } from "@/domain/facets/definitions";
import type { SearchQuery } from "@/domain/facets/types";
import { serializeSearchQuery } from "@/domain/facets/url";
import { cityLabels, genderLabels } from "@/domain/kos/labels";
import type { CitySlug, Gender } from "@/domain/kos/types";
import {
	campusByQuery,
	campusPath,
	cityPath,
	genderPath,
	tipePath,
} from "./locations";
import { metaDescription, pageTitle } from "./site";

export type SearchIndexPolicy = {
	path: string;
	index: boolean;
	title: string;
	description: string;
};

function findCity(value: string | undefined): CitySlug | undefined {
	return CITIES.find((city) => city === value);
}

function findGender(value: string | undefined): Gender | undefined {
	return GENDERS.find((gender) => gender === value);
}

function searchQueryPath(query: SearchQuery): string {
	const params = serializeSearchQuery({
		...query,
		view: "split",
		bounds: undefined,
		sort: "recommended",
	});
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== "") {
			search.set(key, value);
		}
	}
	const encoded = search.toString();
	return encoded ? `/cari?${encoded}` : "/cari";
}

function hasExtraFilters(query: SearchQuery): boolean {
	return (
		query.duration !== undefined ||
		query.priceMin !== undefined ||
		query.priceMax !== undefined ||
		query.facilities.length > 0 ||
		query.rules.length > 0 ||
		query.availableOnly ||
		query.badges.length > 0 ||
		query.sort !== "recommended" ||
		query.bounds !== undefined
	);
}

export function searchHeading(query: SearchQuery): string {
	const city = findCity(query.city);
	const gender = findGender(query.gender);
	if (city && gender) {
		return `Kos ${genderLabels[gender]} di ${cityLabels[city]}`;
	}
	if (city) {
		return `Kos di ${cityLabels[city]}`;
	}
	if (gender) {
		return `Kos ${genderLabels[gender]}`;
	}
	const q = query.q?.trim();
	if (q) {
		return `Kos di ${q}`;
	}
	return "Kos untuk disewa";
}

export function searchIndexPolicy(query: SearchQuery): SearchIndexPolicy {
	const heading = searchHeading(query);
	const city = findCity(query.city);
	const gender = findGender(query.gender);
	const campus = campusByQuery(query.q, city);
	const extra = hasExtraFilters(query);
	const q = query.q?.trim();

	if (
		!extra &&
		campus &&
		(!q || q.toLowerCase() === campus.label.toLowerCase())
	) {
		return {
			path: campusPath(campus.slug),
			index: false,
			title: pageTitle(`Kos dekat ${campus.label}`, campus.cityLabel),
			description: metaDescription(
				`Cari kos dekat ${campus.label}, ${campus.cityLabel}. Filter harga, tipe, dan fasilitas di Ibukos.`,
			),
		};
	}

	if (!extra && city && gender && !q) {
		return {
			path: genderPath(city, gender),
			index: false,
			title: pageTitle(`Kos ${genderLabels[gender]} ${cityLabels[city]}`),
			description: metaDescription(
				`Kos ${genderLabels[gender].toLowerCase()} di ${cityLabels[city]}. Bandingkan harga, fasilitas, dan sisa kamar di Ibukos.`,
			),
		};
	}

	if (!extra && city && !gender && !q) {
		return {
			path: cityPath(city),
			index: false,
			title: pageTitle(`Kos ${cityLabels[city]}`),
			description: metaDescription(
				`Kos di ${cityLabels[city]}. Cari kamar putra, putri, atau campur, lalu sewa dari Ibukos.`,
			),
		};
	}

	if (!extra && gender && !city && !q) {
		return {
			path: tipePath(gender),
			index: false,
			title: pageTitle(`Kos ${genderLabels[gender]}`),
			description: metaDescription(
				`Cari kos ${genderLabels[gender].toLowerCase()} di Yogyakarta, Jakarta, Bandung, dan kota lain di Ibukos.`,
			),
		};
	}

	if (!extra && !city && !gender && !q) {
		return {
			path: "/cari",
			index: true,
			title: pageTitle("Cari kos"),
			description: metaDescription(
				"Cari kos di seluruh Indonesia. Saring berdasarkan kota, kampus, tipe, harga, dan fasilitas.",
			),
		};
	}

	return {
		path: searchQueryPath(query),
		index: false,
		title: pageTitle(heading),
		description: metaDescription(
			`${heading} di Ibukos. Bandingkan harga, fasilitas, dan sisa kamar sebelum sewa.`,
		),
	};
}
