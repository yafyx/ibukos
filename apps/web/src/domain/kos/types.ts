export type Gender = "putra" | "putri" | "campur";

export type Duration = "mingguan" | "bulanan" | "3bulan" | "6bulan" | "tahunan";

export type SortKey = "recommended" | "price-asc" | "price-desc";

export type FacilityId =
	| "km-dalam"
	| "wifi"
	| "ac"
	| "kasur"
	| "kloset-duduk"
	| "parkir-motor"
	| "parkir-mobil"
	| "dapur"
	| "listrik";

export type RuleId = "akses-24jam" | "pasutri" | "hewan" | "karyawan";

export type BadgeId = "promo" | "dikelola" | "andalan";

export type CitySlug =
	| "yogyakarta"
	| "jakarta"
	| "bandung"
	| "surabaya"
	| "malang"
	| "semarang"
	| "medan";

export type KosListing = {
	slug: string;
	name: string;
	city: CitySlug;
	area: string;
	campus?: string;
	gender: Gender;
	durations: Duration[];
	priceMonthly: number;
	pricePromo?: number;
	roomsAvailable: number;
	rating?: number;
	facilities: FacilityId[];
	rules: RuleId[];
	badges: BadgeId[];
	photo: string;
	photos?: string[];
	facilitySnippet: string;
};

export type KosDetail = KosListing & {
	description: string;
	photos: string[];
	address: string;
	ownerLabel: string;
};

export type PromoSlide = {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	query?: Partial<import("../facets/types").SearchQuery>;
};

export type AreaTile = {
	slug: CitySlug | string;
	label: string;
	image: string;
	query: Partial<import("../facets/types").SearchQuery>;
};
