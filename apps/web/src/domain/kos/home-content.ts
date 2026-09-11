import type { SearchQuery } from "@/domain/facets/types";

export type HomeFeature = {
	id: string;
	title: string;
	description: string;
};

export type WhyChooseFeature = {
	id: "booking" | "verified" | "promo";
	title: string;
	description: string;
};

export const whyChooseFeatures: WhyChooseFeature[] = [
	{
		id: "booking",
		title: "Booking Langsung",
		description:
			"Ajukan sewa kos langsung dari situs Ibukos. Lebih praktis dan aman tanpa harus atur ketemuan berulang dengan pemilik kos.",
	},
	{
		id: "verified",
		title: "Data Kos Akurat",
		description:
			"Setiap listing dilengkapi foto, fasilitas, harga, dan info ketersediaan kamar supaya kamu bisa bandingkan sebelum memutuskan.",
	},
	{
		id: "promo",
		title: "Banyak Promo & Diskon",
		description:
			"Temukan kos dengan harga spesial, promo musiman, dan penawaran terbatas dari pemilik kos di seluruh Indonesia.",
	},
];

export const homeFeatures: HomeFeature[] = [
	{
		id: "search",
		title: "Fitur Pencarian",
		description:
			"Cari kos di sekitarmu atau di seluruh Indonesia. Masukkan nama lokasi, area, alamat, atau kampus tujuan.",
	},
	{
		id: "filter",
		title: "Filter Pencarian",
		description:
			"Saring kos berdasarkan fasilitas, tipe kos, harga, dan aturan huni. Temukan kos putra, putri, campur, atau pasutri dengan lebih cepat.",
	},
	{
		id: "photos",
		title: "Foto & Detail Kos",
		description:
			"Setiap listing dilengkapi foto, fasilitas, harga, dan info ketersediaan kamar supaya kamu bisa bandingkan sebelum memutuskan.",
	},
	{
		id: "booking",
		title: "Sewa Langsung via Ibukos",
		description:
			"Ajukan sewa kos langsung dari situs Ibukos. Lebih praktis dan aman tanpa harus atur ketemuan berulang dengan pemilik kos.",
	},
	{
		id: "review",
		title: "Kos Review",
		description:
			"Baca ulasan penghuni kos sebelum memutuskan. Kamu juga bisa menulis pengalaman ngekos untuk membantu pencari kos lainnya.",
	},
];

export type InfoBannerContent = {
	title: string;
	description: string;
	cta: string;
	image: string;
	query: Partial<SearchQuery>;
};

export const surveyBanner: InfoBannerContent = {
	title: "Survei Kos Idaman Kamu Sekarang!",
	description:
		"Untungnya ada fitur survei kos di Ibukos. Cari, pilih, survei, hingga sewa kos idaman dijamin aman dan gratis.",
	cta: "Baca selengkapnya",
	image:
		"https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
	query: { sort: "recommended" },
};

export const managedKosBanner: InfoBannerContent = {
	title: "Kos Dikelola Ibukos, Terjamin Nyaman",
	description:
		"Disurvey langsung oleh tim Ibukos. Lokasi terverifikasi, bangunan kos lolos seleksi.",
	cta: "Lihat kos dikelola",
	image:
		"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
	query: { badges: ["dikelola"] },
};
