import type {
	BadgeId,
	CitySlug,
	Duration,
	FacilityId,
	Gender,
	RuleId,
	SortKey,
} from "./types";

export const genderLabels: Record<Gender, string> = {
	putra: "Putra",
	putri: "Putri",
	campur: "Campur",
};

/** Solid chip background + white label (Mamikos gender badge style). */
export const genderChipClass: Record<Gender, string> = {
	campur: "border-0 bg-gender-campur font-medium text-white shadow-sm",
	putra: "border-0 bg-gender-putra font-medium text-white shadow-sm",
	putri: "border-0 bg-gender-putri font-medium text-white shadow-sm",
};

/** Price text color keyed to gender (listing footer, detail header). */
export const genderPriceClass: Record<Gender, string> = {
	campur: "text-gender-campur",
	putra: "text-gender-putra",
	putri: "text-gender-putri",
};

export const durationLabels: Record<Duration, string> = {
	mingguan: "Mingguan",
	bulanan: "Bulanan",
	"3bulan": "3 Bulan",
	"6bulan": "6 Bulan",
	tahunan: "Tahunan",
};

export const sortLabels: Record<SortKey, string> = {
	recommended: "Rekomendasi",
	"price-asc": "Harga terendah",
	"price-desc": "Harga tertinggi",
};

export const cityLabels: Record<CitySlug, string> = {
	yogyakarta: "Yogyakarta",
	jakarta: "Jakarta",
	bandung: "Bandung",
	surabaya: "Surabaya",
	malang: "Malang",
	semarang: "Semarang",
	medan: "Medan",
};

export const facilityLabels: Record<FacilityId, string> = {
	"km-dalam": "Kamar mandi dalam",
	wifi: "Wi-Fi",
	ac: "AC",
	kasur: "Kasur",
	"kloset-duduk": "Kloset duduk",
	"parkir-motor": "Parkir motor",
	"parkir-mobil": "Parkir mobil",
	dapur: "Dapur",
	listrik: "Listrik termasuk",
};

export const ruleLabels: Record<RuleId, string> = {
	"akses-24jam": "Akses 24 jam",
	pasutri: "Pasutri",
	hewan: "Boleh hewan",
	karyawan: "Karyawan",
};

export const badgeLabels: Record<BadgeId, string> = {
	promo: "Promo",
	dikelola: "Dikelola Ibukos",
	andalan: "Andalan",
};

export function formatPriceIdr(amount: number): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(amount);
}

export function formatPriceFilterLabel(
	priceMin?: number,
	priceMax?: number,
): string | undefined {
	const hasMin = priceMin !== undefined && priceMin > 0;
	const hasMax = priceMax !== undefined;
	if (!hasMin && !hasMax) {
		return undefined;
	}
	if (hasMin && hasMax) {
		return `${formatPriceIdr(priceMin)} – ${formatPriceIdr(priceMax)}`;
	}
	if (hasMin) {
		return `Min ${formatPriceIdr(priceMin)}`;
	}
	return `s.d. ${formatPriceIdr(priceMax ?? 0)}`;
}

export function formatSavingIdr(monthly: number, promo: number): string {
	return `Hemat ${formatPriceIdr(monthly - promo)}`;
}

/** Compact promo label, e.g. "77rb" or "1,1jt". */
export function formatDiscountShortIdr(monthly: number, promo: number): string {
	const diff = monthly - promo;
	if (diff >= 1_000_000) {
		const jt = diff / 1_000_000;
		return `${Number.isInteger(jt) ? jt : jt.toFixed(1).replace(".", ",")}jt`;
	}
	return `${Math.round(diff / 1000)}rb`;
}

/** Compact pin price, e.g. "Rp750rb" or "Rp1,85jt". */
export function formatPinPriceIdr(amount: number): string {
	if (amount >= 1_000_000) {
		const jt = amount / 1_000_000;
		const body = Number.isInteger(jt)
			? String(jt)
			: String(Number(jt.toFixed(2))).replace(".", ",");
		return `Rp${body}jt`;
	}
	return `Rp${Math.round(amount / 1000)}rb`;
}

export const cityCenter: Record<CitySlug, { lat: number; lng: number }> = {
	yogyakarta: { lat: -7.7956, lng: 110.3695 },
	jakarta: { lat: -6.2088, lng: 106.8456 },
	bandung: { lat: -6.9175, lng: 107.6191 },
	surabaya: { lat: -7.2575, lng: 112.7521 },
	malang: { lat: -7.9666, lng: 112.6326 },
	semarang: { lat: -6.9667, lng: 110.4167 },
	medan: { lat: 3.5952, lng: 98.6722 },
};

export function listingCoords(
	slug: string,
	city: CitySlug,
): { lat: number; lng: number } {
	const center = cityCenter[city];
	let hash = 0;
	for (const char of slug) {
		hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
	}
	return {
		lat: center.lat + ((hash % 90) - 45) / 2500,
		lng: center.lng + (((hash >>> 8) % 90) - 45) / 2500,
	};
}
