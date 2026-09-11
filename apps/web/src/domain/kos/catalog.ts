import { cityLabels } from "./labels";
import type {
	AreaTile,
	CitySlug,
	KosDetail,
	KosListing,
	PromoCityGroup,
	PromoSlide,
} from "./types";

const catalog: KosDetail[] = [
	{
		slug: "kos-mawar-ugm",
		name: "Kos Mawar UGM",
		city: "yogyakarta",
		area: "Sekip, Sleman",
		campus: "UGM",
		gender: "putri",
		durations: ["bulanan", "3bulan", "6bulan"],
		priceMonthly: 850_000,
		pricePromo: 750_000,
		roomsAvailable: 2,
		rating: 4.8,
		facilities: ["km-dalam", "wifi", "ac", "kasur", "parkir-motor"],
		rules: ["akses-24jam"],
		badges: ["promo", "dikelola"],
		photo:
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
		facilitySnippet: "KM dalam · Wi-Fi · AC",
		description:
			"Kos nyaman dekat kampus UGM dengan kamar mandi dalam dan Wi-Fi cepat. Cocok untuk mahasiswi yang cari tempat tenang dan aman.",
		photos: [
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
			"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
		],
		address: "Jl. Sekip Utara No. 12, Sleman, DIY",
		ownerLabel: "Bu Siti",
	},
	{
		slug: "kos-bambu-seturan",
		name: "Kos Bambu Seturan",
		city: "yogyakarta",
		area: "Seturan, Sleman",
		campus: "UGM",
		gender: "putra",
		durations: ["bulanan", "tahunan"],
		priceMonthly: 1_200_000,
		pricePromo: 1_050_000,
		roomsAvailable: 1,
		rating: 4.5,
		facilities: ["km-dalam", "wifi", "ac", "parkir-mobil", "dapur"],
		rules: ["akses-24jam", "karyawan"],
		badges: ["andalan"],
		photo:
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
		facilitySnippet: "KM dalam · Parkir mobil · Dapur",
		description:
			"Kos premium di Seturan dengan fasilitas lengkap dan parkir mobil.",
		photos: [
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
		],
		address: "Jl. Seturan Raya No. 21, Sleman, DIY",
		ownerLabel: "Pak Budi",
	},
	{
		slug: "kos-melati-uny",
		name: "Kos Melati UNY",
		city: "yogyakarta",
		area: "Condongcatur",
		campus: "UNY",
		gender: "putri",
		durations: ["bulanan", "3bulan"],
		priceMonthly: 700_000,
		roomsAvailable: 3,
		rating: 4.3,
		facilities: ["wifi", "kasur", "parkir-motor", "listrik"],
		rules: ["akses-24jam"],
		badges: [],
		photo:
			"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
		facilitySnippet: "Wi-Fi · Parkir motor · Listrik termasuk",
		description:
			"Kos ekonomis dekat UNY dengan harga terjangkau untuk mahasiswi.",
		photos: [
			"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
		],
		address: "Jl. Magelang KM 6, Condongcatur, Sleman",
		ownerLabel: "Ibu Rina",
	},
	{
		slug: "kos-cendana-itb",
		name: "Kos Cendana ITB",
		city: "bandung",
		area: "Dago",
		campus: "ITB",
		gender: "campur",
		durations: ["bulanan", "6bulan", "tahunan"],
		priceMonthly: 1_500_000,
		pricePromo: 1_350_000,
		roomsAvailable: 2,
		rating: 4.7,
		facilities: ["km-dalam", "wifi", "ac", "kloset-duduk", "parkir-motor"],
		rules: ["akses-24jam", "pasutri"],
		badges: ["promo", "andalan"],
		photo:
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
		facilitySnippet: "KM dalam · AC · Kloset duduk",
		description:
			"Kos strategis di Dago dekat ITB. View pegunungan, fasilitas modern.",
		photos: [
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
			"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
		],
		address: "Jl. Dago Pojok No. 8, Bandung",
		ownerLabel: "Pak Agus",
	},
	{
		slug: "kos-teratai-ui-depok",
		name: "Kos Teratai UI Depok",
		city: "jakarta",
		area: "Depok",
		campus: "UI",
		gender: "putra",
		durations: ["bulanan", "3bulan"],
		priceMonthly: 950_000,
		pricePromo: 850_000,
		roomsAvailable: 4,
		rating: 4.2,
		facilities: ["wifi", "kasur", "parkir-motor", "listrik"],
		rules: ["karyawan"],
		badges: ["dikelola"],
		photo:
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
		facilitySnippet: "Wi-Fi · Parkir motor",
		description:
			"Kos praktis untuk mahasiswa UI Depok dengan akses transport umum mudah.",
		photos: [
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
		],
		address: "Jl. Margonda Raya No. 45, Depok",
		ownerLabel: "Pak Hendra",
	},
	{
		slug: "kos-anggrek-ui",
		name: "Kos Anggrek UI",
		city: "jakarta",
		area: "Salemba",
		campus: "UI",
		gender: "putri",
		durations: ["bulanan", "6bulan"],
		priceMonthly: 1_100_000,
		pricePromo: 990_000,
		roomsAvailable: 1,
		rating: 4.6,
		facilities: ["km-dalam", "wifi", "ac", "parkir-motor"],
		rules: ["akses-24jam"],
		badges: ["promo"],
		photo:
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
		facilitySnippet: "KM dalam · AC · Wi-Fi",
		description: "Kos putri aman di Salemba, dekat kampus UI Pusat.",
		photos: [
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
		],
		address: "Jl. Salemba Raya No. 22, Jakarta Pusat",
		ownerLabel: "Bu Dewi",
	},
	{
		slug: "kos-jasmine-its",
		name: "Kos Jasmine ITS",
		city: "surabaya",
		area: "Keputih",
		campus: "ITS",
		gender: "putri",
		durations: ["bulanan", "3bulan", "6bulan"],
		priceMonthly: 800_000,
		pricePromo: 720_000,
		roomsAvailable: 2,
		rating: 4.4,
		facilities: ["wifi", "ac", "kasur", "parkir-motor", "listrik"],
		rules: ["akses-24jam"],
		badges: [],
		photo:
			"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
		facilitySnippet: "AC · Wi-Fi · Listrik termasuk",
		description: "Kos dekat ITS Surabaya, lingkungan tenang dan bersih.",
		photos: [
			"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
			"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
		],
		address: "Jl. Keputih Sukolilo No. 15, Surabaya",
		ownerLabel: "Ibu Maya",
	},
	{
		slug: "kos-merpati-unair",
		name: "Kos Merpati UNAIR",
		city: "surabaya",
		area: "Mulyorejo",
		campus: "UNAIR",
		gender: "putra",
		durations: ["bulanan", "tahunan"],
		priceMonthly: 750_000,
		roomsAvailable: 5,
		rating: 4.1,
		facilities: ["wifi", "kasur", "parkir-motor"],
		rules: ["karyawan"],
		badges: [],
		photo:
			"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
		facilitySnippet: "Wi-Fi · Parkir motor",
		description: "Kos ekonomis dekat UNAIR Kampus B, banyak kamar tersedia.",
		photos: [
			"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
			"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
		],
		address: "Jl. Mulyorejo No. 30, Surabaya",
		ownerLabel: "Pak Joko",
	},
	{
		slug: "kos-lavender-ub",
		name: "Kos Lavender UB",
		city: "malang",
		area: "Lowokwaru",
		campus: "UB",
		gender: "putri",
		durations: ["bulanan", "3bulan"],
		priceMonthly: 650_000,
		pricePromo: 580_000,
		roomsAvailable: 3,
		rating: 4.5,
		facilities: ["km-dalam", "wifi", "kasur", "parkir-motor", "listrik"],
		rules: ["akses-24jam"],
		badges: ["promo", "dikelola"],
		photo:
			"https://images.unsplash.com/photo-1567767292274-a7d12f43c908?w=800&q=80",
		facilitySnippet: "KM dalam · Wi-Fi · Listrik termasuk",
		description:
			"Kos nyaman dekat UB Malang dengan harga promo untuk mahasiswi baru.",
		photos: [
			"https://images.unsplash.com/photo-1567767292274-a7d12f43c908?w=1200&q=80",
			"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
		],
		address: "Jl. MT Haryono No. 18, Malang",
		ownerLabel: "Bu Lestari",
	},
	{
		slug: "kos-dahlia-um",
		name: "Kos Dahlia UM",
		city: "malang",
		area: "Dinoyo",
		campus: "UM",
		gender: "campur",
		durations: ["bulanan", "6bulan"],
		priceMonthly: 700_000,
		pricePromo: 630_000,
		roomsAvailable: 2,
		rating: 4.0,
		facilities: ["wifi", "ac", "parkir-motor", "dapur"],
		rules: ["pasutri", "hewan"],
		badges: [],
		photo:
			"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
		facilitySnippet: "AC · Dapur · Parkir motor",
		description:
			"Kos campur dekat UM dengan dapur bersama dan boleh hewan peliharaan.",
		photos: [
			"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
			"https://images.unsplash.com/photo-1567767292274-a7d12f43c908?w=1200&q=80",
		],
		address: "Jl. Semarang No. 5, Malang",
		ownerLabel: "Pak Rudi",
	},
	{
		slug: "kos-orchid-undip",
		name: "Kos Orchid UNDIP",
		city: "semarang",
		area: "Tembalang",
		campus: "UNDIP",
		gender: "putra",
		durations: ["bulanan", "3bulan", "6bulan"],
		priceMonthly: 600_000,
		pricePromo: 540_000,
		roomsAvailable: 4,
		rating: 4.3,
		facilities: ["wifi", "kasur", "parkir-motor", "listrik"],
		rules: ["akses-24jam", "karyawan"],
		badges: ["andalan"],
		photo:
			"https://images.unsplash.com/photo-1536376072261-38c75010a6c9?w=800&q=80",
		facilitySnippet: "Wi-Fi · Listrik termasuk",
		description: "Kos andalan mahasiswa UNDIP Tembalang, harga terjangkau.",
		photos: [
			"https://images.unsplash.com/photo-1536376072261-38c75010a6c9?w=1200&q=80",
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
		],
		address: "Jl. Prof. Sudarto No. 10, Tembalang, Semarang",
		ownerLabel: "Pak Wawan",
	},
	{
		slug: "kos-lotus-usu",
		name: "Kos Lotus USU",
		city: "medan",
		area: "Padang Bulan",
		campus: "USU",
		gender: "putri",
		durations: ["bulanan", "tahunan"],
		priceMonthly: 900_000,
		pricePromo: 800_000,
		roomsAvailable: 1,
		rating: 4.6,
		facilities: ["km-dalam", "wifi", "ac", "kloset-duduk", "parkir-mobil"],
		rules: ["akses-24jam"],
		badges: ["promo", "andalan"],
		photo:
			"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
		facilitySnippet: "KM dalam · AC · Parkir mobil",
		description: "Kos premium dekat USU Medan dengan fasilitas lengkap.",
		photos: [
			"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
			"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80",
		],
		address: "Jl. Padang Bulan No. 7, Medan",
		ownerLabel: "Bu Sari",
	},
	{
		slug: "kos-sakura-uii",
		name: "Kos Sakura UII",
		city: "yogyakarta",
		area: "Ngaglik",
		campus: "UII",
		gender: "putra",
		durations: ["bulanan", "mingguan"],
		priceMonthly: 550_000,
		roomsAvailable: 6,
		rating: 3.9,
		facilities: ["wifi", "kasur", "parkir-motor"],
		rules: ["karyawan"],
		badges: [],
		photo:
			"https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
		facilitySnippet: "Wi-Fi · Parkir motor",
		description:
			"Kos ekonomis dekat UII, tersedia sewa mingguan untuk short stay.",
		photos: [
			"https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
		],
		address: "Jl. Kaliurang KM 13, Ngaglik, Sleman",
		ownerLabel: "Pak Yanto",
	},
	{
		slug: "kos-tulip-ipb",
		name: "Kos Tulip IPB",
		city: "jakarta",
		area: "Dramaga",
		campus: "IPB",
		gender: "campur",
		durations: ["bulanan", "6bulan"],
		priceMonthly: 780_000,
		roomsAvailable: 3,
		rating: 4.2,
		facilities: ["wifi", "ac", "dapur", "parkir-motor", "listrik"],
		rules: ["akses-24jam", "pasutri"],
		badges: ["dikelola"],
		photo:
			"https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80",
		facilitySnippet: "AC · Dapur · Listrik termasuk",
		description:
			"Kos dikelola Ibukos dekat IPB Dramaga, cocok pasutri mahasiswa.",
		photos: [
			"https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80",
			"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
		],
		address: "Jl. Raya Dramaga, Bogor",
		ownerLabel: "Ibukos Managed",
	},
	{
		slug: "kos-violet-unpad",
		name: "Kos Violet UNPAD",
		city: "bandung",
		area: "Jatinangor",
		campus: "UNPAD",
		gender: "putri",
		durations: ["bulanan", "3bulan"],
		priceMonthly: 720_000,
		pricePromo: 650_000,
		roomsAvailable: 2,
		rating: 4.4,
		facilities: ["km-dalam", "wifi", "kasur", "parkir-motor"],
		rules: ["akses-24jam"],
		badges: [],
		photo:
			"https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
		facilitySnippet: "KM dalam · Wi-Fi",
		description:
			"Kos putri dekat UNPAD Jatinangor, lingkungan kampus yang aman.",
		photos: [
			"https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
			"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
		],
		address: "Jl. Raya Jatinangor No. 3, Sumedang",
		ownerLabel: "Bu Fitri",
	},
	{
		slug: "kos-garden-uns",
		name: "Kos Garden UNS",
		city: "semarang",
		area: "Solo",
		campus: "UNS",
		gender: "putra",
		durations: ["bulanan", "tahunan"],
		priceMonthly: 680_000,
		roomsAvailable: 0,
		rating: 4.0,
		facilities: ["wifi", "kasur", "parkir-motor", "listrik"],
		rules: ["karyawan"],
		badges: [],
		photo:
			"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
		facilitySnippet: "Wi-Fi · Listrik termasuk",
		description:
			"Kos dekat UNS Solo, saat ini penuh. Daftar waiting list via Ibukos.",
		photos: [
			"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
			"https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
		],
		address: "Jl. Ir. Sutami No. 36, Solo",
		ownerLabel: "Pak Slamet",
	},
];

export function getCatalog(): readonly KosDetail[] {
	return catalog;
}

export function getListingBySlug(slug: string): KosDetail | undefined {
	return catalog.find((listing) => listing.slug === slug);
}

export function getSimilarListings(slug: string, limit = 4): KosListing[] {
	const current = getListingBySlug(slug);
	if (!current) {
		return [];
	}
	return catalog
		.filter((listing) => listing.slug !== slug && listing.city === current.city)
		.slice(0, limit);
}

export const promoSlides: PromoSlide[] = [
	{
		id: "promo-longterm",
		title: "Ngekos Lebih Tenang Hingga Setahun",
		subtitle:
			"Nikmati potongan spesial untuk sewa jangka panjang dan bereskan urusan kos lebih awal.",
		image:
			"https://static.mamikos.com/uploads/cache/data/event/2026-05-11/Eu70Obie-540x720.webp",
		query: { badges: ["promo"] },
	},
	{
		id: "promo-ngebut",
		title: "Kos Dekat Kampus Favorit Cepat Jadi Rebutan",
		subtitle:
			"Buruan booking kos incaranmu lewat promo ngebut sebelum keduluan yang lain.",
		image:
			"https://static.mamikos.com/uploads/cache/data/event/2026-09-01/WEnomGQo-540x720.webp",
		query: { sort: "recommended", badges: ["promo"] },
	},
	{
		id: "promo-starterpack",
		title: "Mulai Ngekos Nyaman Tanpa Ribet dari Awal",
		subtitle: "Diskon 50 ribu untuk bulan pertama di kos pilihan Ibukos.",
		image:
			"https://static.mamikos.com/uploads/cache/data/event/2026-05-11/FaPgmzjY-540x720.webp",
		query: { badges: ["promo"] },
	},
	{
		id: "promo-andalan",
		title: "Voucher Ngekos 100 Ribu Udah Siap Buat Kamu",
		subtitle:
			"Ajukan survei ke kos andalan, isi penilaian, dan klaim vouchernya.",
		image:
			"https://static.mamikos.com/uploads/cache/data/event/2025-08-01/DicHKVLP-540x720.jpg",
		query: { badges: ["andalan", "promo"] },
	},
	{
		id: "promo-passtrack",
		title: "Bisa Masuk Kos Tanpa Deposit",
		subtitle:
			"Gak perlu keluar ratusan ribu di depan. Pas keluar tinggal serah kunci.",
		image:
			"https://static.mamikos.com/uploads/cache/data/event/2026-07-17/PvwClVKs-540x720.webp",
		query: { sort: "recommended" },
	},
	{
		id: "promo-proteksi",
		title: "Perlindungan Lebih Luas, Ngekos Tak Lagi Cemas",
		subtitle:
			"Sekarang ada opsi perlindungan tambahan untuk motor dan barang pribadimu.",
		image:
			"https://static.mamikos.com/uploads/cache/data/event/2026-03-06/zQ1fjw0u-540x720.webp",
		query: { badges: ["promo"] },
	},
];

export const popularCities: AreaTile[] = [
	{
		slug: "yogyakarta",
		label: "Yogyakarta",
		image: "/assets/area/desktop/jogja.png",
		query: { city: "yogyakarta" },
	},
	{
		slug: "jakarta",
		label: "Jakarta",
		image: "/assets/area/desktop/jakarta.png",
		query: { city: "jakarta" },
	},
	{
		slug: "bandung",
		label: "Bandung",
		image: "/assets/area/desktop/bandung.png",
		query: { city: "bandung" },
	},
	{
		slug: "surabaya",
		label: "Surabaya",
		image: "/assets/area/desktop/surabaya.png",
		query: { city: "surabaya" },
	},
	{
		slug: "malang",
		label: "Malang",
		image: "/assets/area/desktop/malang.png",
		query: { city: "malang" },
	},
	{
		slug: "semarang",
		label: "Semarang",
		image: "/assets/area/desktop/semarang.png",
		query: { city: "semarang" },
	},
	{
		slug: "medan",
		label: "Medan",
		image: "/assets/area/desktop/medan.png",
		query: { city: "medan" },
	},
];

export const popularCampuses: AreaTile[] = [
	{
		slug: "ugm",
		label: "UGM",
		subtitle: "Jogja",
		image: "/assets/logo-kampus/UGM.png",
		query: { q: "UGM", city: "yogyakarta" },
	},
	{
		slug: "undip",
		label: "UNDIP",
		subtitle: "Semarang",
		image: "/assets/logo-kampus/UNDIP.png",
		query: { q: "UNDIP", city: "semarang" },
	},
	{
		slug: "ui",
		label: "UI",
		subtitle: "Depok",
		image: "/assets/logo-kampus/UI.png",
		query: { q: "UI", city: "jakarta" },
	},
	{
		slug: "unpad",
		label: "UNPAD",
		subtitle: "Jatinangor",
		image: "/assets/logo-kampus/UNPAD.png",
		query: { q: "UNPAD", city: "bandung" },
	},
	{
		slug: "stan",
		label: "STAN",
		subtitle: "Jakarta",
		image: "/assets/logo-kampus/STAN.png",
		query: { q: "STAN", city: "jakarta" },
	},
	{
		slug: "ub",
		label: "UB",
		subtitle: "Malang",
		image: "/assets/logo-kampus/UB.png",
		query: { q: "UB", city: "malang" },
	},
	{
		slug: "unair",
		label: "UNAIR",
		subtitle: "Surabaya",
		image: "/assets/logo-kampus/UNAIR.png",
		query: { q: "UNAIR", city: "surabaya" },
	},
];

export const featuredSlugs = [
	"kos-mawar-ugm",
	"kos-cendana-itb",
	"kos-lavender-ub",
	"kos-lotus-usu",
	"kos-anggrek-ui",
	"kos-orchid-undip",
	"kos-bambu-seturan",
	"kos-melati-uny",
	"kos-teratai-ui-depok",
	"kos-jasmine-its",
	"kos-merpati-unair",
	"kos-dahlia-um",
];

export function getFeaturedListings(): KosListing[] {
	return featuredSlugs
		.map((slug) => getListingBySlug(slug))
		.filter((listing): listing is KosDetail => listing !== undefined);
}

function isPromoListing(listing: KosListing): boolean {
	return listing.badges.includes("promo") || listing.pricePromo !== undefined;
}

function isCitySlug(value: string): value is CitySlug {
	return Object.hasOwn(cityLabels, value);
}

export function getPromoListingsByCity(): PromoCityGroup[] {
	const byCity = new Map<CitySlug, KosListing[]>();

	for (const listing of catalog) {
		if (!isPromoListing(listing)) {
			continue;
		}
		const current = byCity.get(listing.city);
		if (current) {
			current.push(listing);
		} else {
			byCity.set(listing.city, [listing]);
		}
	}

	return popularCities.flatMap((tile) => {
		if (!isCitySlug(tile.slug)) {
			return [];
		}
		const listings = byCity.get(tile.slug);
		if (!listings) {
			return [];
		}
		return [{ city: tile.slug, listings }];
	});
}
