import { cityLabels, facilityLabels } from "./labels";
import type { Duration, KosDetail } from "./types";

export function listingOverview(listing: KosDetail): string {
	const city = cityLabels[listing.city];
	const campus = listing.campus
		? ` Jalan ke ${listing.campus} dekat — hemat waktu tiap pagi.`
		: "";
	const facilityLine = `Fasilitas di kamar: ${listing.facilities
		.map((facility) => facilityLabels[facility])
		.join(", ")}.`;
	const stay =
		listing.durations.includes("tahunan") ||
		listing.durations.includes("6bulan")
			? " Bisa sewa jangka panjang kalau mau lebih hemat."
			: " Sewa bulanan, fleksibel kalau belum siap ikat lama.";
	const rooms =
		listing.roomsAvailable > 0
			? ` Sisa ${listing.roomsAvailable} kamar.`
			: " Saat ini penuh, tapi boleh tanya antrean.";

	return `${listing.description}${campus} Lokasi di ${listing.area}, ${city}. ${facilityLine}${stay}${rooms}`;
}

export function listingLoveItems(listing: KosDetail): string[] {
	const items: string[] = [];
	if (listing.campus) {
		items.push(`Dekat ${listing.campus}`);
	}
	if (listing.facilities.includes("km-dalam")) {
		items.push("Kamar mandi dalam");
	}
	if (listing.facilities.includes("wifi")) {
		items.push("Wi-Fi");
	}
	if (listing.rules.includes("akses-24jam")) {
		items.push("Akses 24 jam");
	}
	if (listing.facilities.includes("listrik")) {
		items.push("Listrik termasuk");
	}
	if (listing.badges.includes("dikelola")) {
		items.push("Dikelola Ibukos");
	}
	return items.slice(0, 4);
}

export function listingGreatFor(listing: KosDetail): string[] {
	const items: string[] = [];
	if (listing.gender === "putri") {
		items.push("Mahasiswi");
	} else if (listing.gender === "putra") {
		items.push("Mahasiswa");
	} else {
		items.push("Campur");
	}
	if (listing.campus) {
		items.push("Anak kampus");
	}
	if (listing.rules.includes("karyawan")) {
		items.push("Karyawan");
	}
	if (listing.rules.includes("pasutri")) {
		items.push("Pasangan");
	}
	if (listing.rules.includes("hewan")) {
		items.push("Bawa hewan");
	}
	return items.slice(0, 4);
}

const durationFactor: Record<Duration, number> = {
	mingguan: 0.28,
	bulanan: 1,
	"3bulan": 0.95,
	"6bulan": 0.9,
	tahunan: 0.85,
};

export function durationMonthlyPrice(
	listing: KosDetail,
	duration: Duration,
): number {
	const monthly = listing.pricePromo ?? listing.priceMonthly;
	return Math.round((monthly * durationFactor[duration]) / 1000) * 1000;
}

export function ownerPhoneFor(slug: string): string {
	let hash = 0;
	for (const char of slug) {
		hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
	}
	const tail = String(1000 + (hash % 9000));
	return `0812-445-${tail}`;
}

export function ownerWhatsAppHref(listing: KosDetail): string {
	const digits = ownerPhoneFor(listing.slug).replace(/\D/g, "");
	const international = digits.replace(/^0/, "62");
	const text = encodeURIComponent(
		`Halo ${listing.ownerLabel}, saya tertarik dengan ${listing.name}. Masih ada kamar?`,
	);
	return `https://wa.me/${international}?text=${text}`;
}

export function splitOverview(text: string): { teaser: string; rest: string } {
	if (text.length < 220) {
		return { teaser: text, rest: "" };
	}
	const cut = text.indexOf(". ", 150);
	const at = cut === -1 ? 180 : cut + 1;
	return {
		teaser: text.slice(0, at).trim(),
		rest: text.slice(at).trim(),
	};
}

export function upcomingDays(count = 4): Date[] {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	return Array.from({ length: count }, (_, index) => {
		const next = new Date(start);
		next.setDate(start.getDate() + index);
		return next;
	});
}

export function sameDay(left: Date, right: Date): boolean {
	return left.toDateString() === right.toDateString();
}
