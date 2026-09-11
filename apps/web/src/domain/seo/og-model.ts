import { cityLabels, formatPriceIdr, genderLabels } from "@/domain/kos/labels";
import type { CitySlug, Gender, KosDetail } from "@/domain/kos/types";
import {
	type CampusLanding,
	cityListings,
	genderCityListings,
	tipeListings,
} from "./locations";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const GENDER_OG_COLOR: Record<Gender, string> = {
	putri: "#db2777",
	putra: "#2563eb",
	campur: "#9333ea",
};

export type OgCardModel = {
	kicker: string;
	title: string;
	subtitle: string;
	badge?: { label: string; color: string };
	photo?: string;
	price?: string;
};

export function homeOgCard(): OgCardModel {
	return {
		kicker: SITE_NAME,
		title: "Cari kos, sewa langsung",
		subtitle: SITE_TAGLINE,
	};
}

export function listingOgCard(listing: KosDetail): OgCardModel {
	return {
		kicker: SITE_NAME,
		title: listing.name,
		subtitle: `${listing.area}, ${cityLabels[listing.city]}`,
		badge: {
			label: `Kos ${genderLabels[listing.gender]}`,
			color: GENDER_OG_COLOR[listing.gender],
		},
		photo: listing.photos[0] ?? listing.photo,
		price: `${formatPriceIdr(listing.pricePromo ?? listing.priceMonthly)} / bulan`,
	};
}

export function cityOgCard(city: CitySlug): OgCardModel {
	const listings = cityListings(city);
	return {
		kicker: SITE_NAME,
		title: `Kos di ${cityLabels[city]}`,
		subtitle: placeSubtitle(listings),
	};
}

export function genderCityOgCard(city: CitySlug, gender: Gender): OgCardModel {
	const listings = genderCityListings(city, gender);
	return {
		kicker: SITE_NAME,
		title: `Kos ${genderLabels[gender]} ${cityLabels[city]}`,
		subtitle: placeSubtitle(listings),
		badge: {
			label: genderLabels[gender],
			color: GENDER_OG_COLOR[gender],
		},
	};
}

export function campusOgCard(campus: CampusLanding): OgCardModel {
	return {
		kicker: SITE_NAME,
		title: `Kos dekat ${campus.label}`,
		subtitle: `${campus.cityLabel} · ${placeSubtitle(campus.listings)}`,
	};
}

export function tipeOgCard(gender: Gender): OgCardModel {
	const listings = tipeListings(gender);
	return {
		kicker: SITE_NAME,
		title: `Kos ${genderLabels[gender]}`,
		subtitle: placeSubtitle(listings),
		badge: {
			label: genderLabels[gender],
			color: GENDER_OG_COLOR[gender],
		},
	};
}

export function searchOgCard(): OgCardModel {
	return {
		kicker: SITE_NAME,
		title: "Cari kos",
		subtitle: "Saring kota, kampus, tipe, harga, dan fasilitas",
	};
}

function placeSubtitle(
	listings: readonly { pricePromo?: number; priceMonthly: number }[],
): string {
	if (listings.length === 0) {
		return "Belum ada listing";
	}
	const min = Math.min(
		...listings.map((item) => item.pricePromo ?? item.priceMonthly),
	);
	return `${listings.length} listing · mulai ${formatPriceIdr(min)}/bulan`;
}
