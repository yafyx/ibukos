import type { BadgeId, CitySlug, Duration, FacilityId, Gender, RuleId, SortKey } from "./types";

export const genderLabels: Record<Gender, string> = {
	putra: "Putra",
	putri: "Putri",
	campur: "Campur",
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

export function formatSavingIdr(monthly: number, promo: number): string {
	return `Hemat ${formatPriceIdr(monthly - promo)}`;
}
