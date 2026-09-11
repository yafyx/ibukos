import type { SearchQuery } from "@/domain/facets/types";
import { buildCariSearch } from "@/domain/facets/url";
import { cityCenter, cityLabels } from "@/domain/kos/labels";
import type { CitySlug } from "@/domain/kos/types";

export type LocationKind = "campus" | "area" | "station";

export type LocationPlace = {
	id: string;
	label: string;
	kind: LocationKind;
	cityId: string;
	cityLabel: string;
	city?: CitySlug;
	popular?: boolean;
};

export type LocationCityGroup = {
	id: string;
	label: string;
	city?: CitySlug;
	campuses: LocationPlace[];
	areas: LocationPlace[];
	stations: LocationPlace[];
};

function place(
	kind: LocationKind,
	label: string,
	cityId: string,
	cityLabel: string,
	city?: CitySlug,
	popular?: boolean,
): LocationPlace {
	return {
		id: `${kind}:${cityId}:${label.toLowerCase().replace(/\s+/g, "-")}`,
		label,
		kind,
		cityId,
		cityLabel,
		city,
		popular,
	};
}

function group(
	id: string,
	label: string,
	city: CitySlug | undefined,
	campuses: string[],
	areas: string[],
	stations: string[],
	popularCampusLabels: string[] = [],
): LocationCityGroup {
	return {
		id,
		label,
		city,
		campuses: campuses.map((name) =>
			place(
				"campus",
				name,
				id,
				label,
				city,
				popularCampusLabels.includes(name),
			),
		),
		areas: areas.map((name) => place("area", name, id, label, city)),
		stations: stations.map((name) => place("station", name, id, label, city)),
	};
}

export const locationCities: LocationCityGroup[] = [
	group(
		"bali",
		"Bali",
		undefined,
		["Udayana", "Undiknas", "Warmadewa"],
		["Denpasar", "Kuta", "Jimbaran", "Sanur"],
		["Bandara Ngurah Rai", "Terminal Mengwi"],
	),
	group(
		"bandung",
		"Bandung",
		"bandung",
		["ITB", "UNPAD Jatinangor", "UNPAD Dipatiukur", "Telkom University"],
		["Dago", "Jatinangor", "Buah Batu", "Ciumbuleuit"],
		["Stasiun Bandung", "Stasiun Padalarang", "Halte Dago"],
		["ITB", "UNPAD Jatinangor"],
	),
	group(
		"bogor",
		"Bogor",
		undefined,
		["IPB", "Universitas Pakuan"],
		["Dramaga", "Baranangsiang", "Taman Kencana"],
		["Stasiun Bogor", "Stasiun Cilebut"],
		["IPB"],
	),
	group(
		"depok",
		"Depok",
		"jakarta",
		["UI", "Gunadarma"],
		["Beji", "Margonda", "Kukusan", "Pondok Cina"],
		["Stasiun Depok", "Stasiun Pondok Cina", "Stasiun Universitas Indonesia"],
		["UI"],
	),
	group(
		"jakarta",
		"Jakarta",
		"jakarta",
		["STAN", "Binus", "Trisakti", "UNTAR"],
		["Tebet", "Kemang", "Kuningan", "Kelapa Gading"],
		["Stasiun Gambir", "Stasiun Sudirman", "MRT Bundaran HI"],
		["STAN"],
	),
	group(
		"jakarta-pusat",
		"Jakarta Pusat",
		"jakarta",
		["STAN Jakarta", "Universitas Indonesia Salemba"],
		["Menteng", "Cikini", "Tanah Abang"],
		["Stasiun Gondangdia", "Halte Harmoni", "MRT Bundaran HI"],
		["STAN Jakarta"],
	),
	group(
		"jakarta-timur",
		"Jakarta Timur",
		"jakarta",
		["UNJ", "Atma Jaya"],
		["Rawamangun", "Jatinegara", "Cawang"],
		["Stasiun Jatinegara", "LRT Cawang"],
	),
	group(
		"malang",
		"Malang",
		"malang",
		["UB", "UM", "UIN Malang"],
		["Lowokwaru", "Dinoyo", "Dieng", "Soekarno Hatta"],
		["Stasiun Malang", "Stasiun Malang Kota Lama"],
		["UB"],
	),
	group(
		"medan",
		"Medan",
		"medan",
		["USU", "UNIMED"],
		["Padang Bulan", "Setiabudi", "Petisah"],
		["Stasiun Medan"],
	),
	group(
		"semarang",
		"Semarang",
		"semarang",
		["UNDIP", "UNNES"],
		["Tembalang", "Banyumanik", "Pleburan"],
		["Stasiun Semarang Tawang", "Stasiun Semarang Poncol"],
		["UNDIP"],
	),
	group(
		"surabaya",
		"Surabaya",
		"surabaya",
		["UNAIR", "ITS", "UBAYA"],
		["Mulyorejo", "Keputih", "Gubeng", "Wonokromo"],
		["Stasiun Gubeng", "Stasiun Pasar Turi", "Stasiun Wonokromo"],
		["UNAIR"],
	),
	group(
		"yogyakarta",
		"Yogyakarta",
		"yogyakarta",
		["UGM", "UNY", "UMY", "UII"],
		["Seturan", "Sleman", "Condongcatur", "Gejayan"],
		["Stasiun Tugu", "Stasiun Lempuyangan", "Halte UGM"],
		["UGM", "UNY", "UMY"],
	),
];

export const allLocationPlaces: LocationPlace[] = locationCities.flatMap(
	(city) => [...city.campuses, ...city.areas, ...city.stations],
);

const popularOrder = [
	"UGM",
	"UNPAD Jatinangor",
	"STAN Jakarta",
	"UNAIR",
	"UB",
	"UNY",
	"UI",
	"UNDIP",
	"ITB",
	"UMY",
];

export const popularCampuses = popularOrder
	.map((label) =>
		allLocationPlaces.find(
			(place) => place.kind === "campus" && place.label === label,
		),
	)
	.filter((place): place is LocationPlace => place !== undefined);

export const locationKindLabel: Record<LocationKind, string> = {
	campus: "Kampus",
	area: "Area",
	station: "Stasiun & Halte",
};

export function queryForPlace(place: LocationPlace): SearchQuery {
	return buildCariSearch({
		q: place.label,
		city: place.city,
	});
}

export function queryForCity(city: LocationCityGroup): SearchQuery {
	if (city.city) {
		return buildCariSearch({ city: city.city });
	}
	return buildCariSearch({ q: city.label });
}

export function nearestCitySlug(lat: number, lng: number): CitySlug {
	let best: CitySlug = "jakarta";
	let bestDistance = Number.POSITIVE_INFINITY;
	for (const slug of Object.keys(cityCenter) as CitySlug[]) {
		const center = cityCenter[slug];
		const distance = (center.lat - lat) ** 2 + (center.lng - lng) ** 2;
		if (distance < bestDistance) {
			bestDistance = distance;
			best = slug;
		}
	}
	return best;
}

export function placeSearchValue(place: LocationPlace): string {
	return `${place.label} ${place.cityLabel} ${locationKindLabel[place.kind]}`;
}

export { cityLabels };
