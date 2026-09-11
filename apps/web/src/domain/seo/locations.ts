import { CITIES, GENDERS } from "@/domain/facets/definitions";
import { getCatalog, popularCampuses } from "@/domain/kos/catalog";
import { cityLabels } from "@/domain/kos/labels";
import type { CitySlug, Gender, KosListing } from "@/domain/kos/types";

export type CampusLanding = {
	slug: string;
	label: string;
	city?: CitySlug;
	cityLabel: string;
	image?: string;
	listings: KosListing[];
};

export function cityPath(city: CitySlug): string {
	return `/kota/${city}`;
}

export function genderPath(city: CitySlug, gender: Gender): string {
	return `/kota/${city}/${gender}`;
}

export function campusPath(slug: string): string {
	return `/kampus/${slug}`;
}

export function tipePath(gender: Gender): string {
	return `/tipe/${gender}`;
}

export function parseCitySlug(value: string): CitySlug | undefined {
	return CITIES.find((city) => city === value);
}

export function parseGender(value: string): Gender | undefined {
	return GENDERS.find((gender) => gender === value);
}

export function campusSlugFromLabel(label: string): string {
	return label.trim().toLowerCase().replace(/\s+/g, "-");
}

export function cityListings(city: CitySlug): KosListing[] {
	return getCatalog().filter((listing) => listing.city === city);
}

export function genderCityListings(
	city: CitySlug,
	gender: Gender,
): KosListing[] {
	return cityListings(city).filter((listing) => listing.gender === gender);
}

export function tipeListings(gender: Gender): KosListing[] {
	return getCatalog().filter((listing) => listing.gender === gender);
}

function popularCampusBySlug(slug: string) {
	return popularCampuses.find((campus) => campus.slug === slug);
}

export function allCampusLandings(): CampusLanding[] {
	const bySlug = new Map<string, CampusLanding>();

	for (const listing of getCatalog()) {
		if (!listing.campus) {
			continue;
		}
		const slug = campusSlugFromLabel(listing.campus);
		const existing = bySlug.get(slug);
		if (existing) {
			existing.listings.push(listing);
			continue;
		}
		const tile = popularCampusBySlug(slug);
		bySlug.set(slug, {
			slug,
			label: listing.campus,
			city: listing.city,
			cityLabel: cityLabels[listing.city],
			image: tile?.image,
			listings: [listing],
		});
	}

	return [...bySlug.values()].sort((a, b) =>
		a.label.localeCompare(b.label, "id"),
	);
}

export function campusBySlug(slug: string): CampusLanding | undefined {
	return allCampusLandings().find((campus) => campus.slug === slug);
}

export function campusByQuery(
	q: string | undefined,
	city?: CitySlug,
): CampusLanding | undefined {
	const needle = q?.trim().toLowerCase();
	if (!needle) {
		return undefined;
	}
	return allCampusLandings().find((campus) => {
		const labelMatch = campus.label.toLowerCase() === needle;
		const slugMatch = campus.slug === campusSlugFromLabel(needle);
		if (!labelMatch && !slugMatch) {
			return false;
		}
		return city === undefined || campus.city === city;
	});
}

export function cityIntro(
	city: CitySlug,
	listings: readonly KosListing[],
): string {
	const label = cityLabels[city];
	const campuses = [
		...new Set(
			listings
				.map((listing) => listing.campus)
				.filter((campus): campus is string => Boolean(campus)),
		),
	];
	const areas = [...new Set(listings.map((listing) => listing.area))];
	const campusBit =
		campuses.length > 0 ? ` Banyak yang ngekos dekat ${joinId(campuses)}.` : "";
	const areaBit = areas.length > 0 ? ` Listing ada di ${joinId(areas)}.` : "";
	return `Ada ${listings.length} kos di ${label} yang bisa dibandingin di Ibukos.${campusBit}${areaBit} Cek harga, fasilitas, dan sisa kamar, lalu sewa kalau sudah cocok.`;
}

export function genderCityIntro(
	city: CitySlug,
	gender: Gender,
	listings: readonly KosListing[],
): string {
	const label = cityLabels[city];
	const genderWord =
		gender === "putri" ? "putri" : gender === "putra" ? "putra" : "campur";
	return `Ada ${listings.length} kos ${genderWord} di ${label}. Bandingkan harga dan fasilitas, lalu ajukan sewa dari Ibukos.`;
}

export function campusIntro(campus: CampusLanding): string {
	const areas = [...new Set(campus.listings.map((listing) => listing.area))];
	const areaBit =
		areas.length > 0 ? ` Area yang muncul: ${joinId(areas)}.` : "";
	return `Ada ${campus.listings.length} kos dekat ${campus.label}, ${campus.cityLabel}.${areaBit} Cocok kalau kuliah di situ dan mau jalan kaki atau naik motor singkat.`;
}

export function tipeIntro(
	gender: Gender,
	listings: readonly KosListing[],
): string {
	const cities = [
		...new Set(listings.map((listing) => cityLabels[listing.city])),
	];
	const genderWord =
		gender === "putri" ? "putri" : gender === "putra" ? "putra" : "campur";
	return `Kos ${genderWord} di ${joinId(cities.length > 0 ? cities : ["beberapa kota"])}. Saring kota atau kampus kalau sudah punya tujuan.`;
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
