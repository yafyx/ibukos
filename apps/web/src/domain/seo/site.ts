export const SITE_NAME = "Ibukos";
export const SITE_TAGLINE = "Cari dan sewa kos di Indonesia";
export const SITE_DESCRIPTION =
	"Cari kos putra, putri, dan campur di Yogyakarta, Jakarta, Bandung, Surabaya, dan kota lain. Lihat harga, fasilitas, lalu sewa dari Ibukos.";
export const SITE_LOCALE = "id_ID";
export const DEFAULT_OG_IMAGE = "/og";
export const OG_IMAGE_WIDTH = "1200";
export const OG_IMAGE_HEIGHT = "630";
export const OG_IMAGE_TYPE = "image/png";
export const TITLE_SEPARATOR = " | ";

export function siteOrigin(requestUrl?: string): string {
	const fromEnv = import.meta.env.VITE_SITE_URL;
	if (typeof fromEnv === "string" && fromEnv.length > 0) {
		return fromEnv.replace(/\/$/, "");
	}
	if (requestUrl) {
		return new URL(requestUrl).origin;
	}
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	return "";
}

export function ogImagePath(pagePath: string): string {
	const path = pagePath.split("?")[0] ?? pagePath;
	if (path === "/" || path === "") {
		return DEFAULT_OG_IMAGE;
	}
	return `/og${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteUrl(path: string, origin = siteOrigin()): string {
	if (/^https?:\/\//.test(path)) {
		return path;
	}
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return origin ? `${origin}${normalized}` : normalized;
}

export function pageTitle(...parts: string[]): string {
	const seen = new Set<string>();
	const tokens: string[] = [];
	for (const part of parts) {
		const trimmed = part.trim();
		if (!trimmed || seen.has(trimmed)) {
			continue;
		}
		seen.add(trimmed);
		tokens.push(trimmed);
	}
	if (!seen.has(SITE_NAME)) {
		tokens.push(SITE_NAME);
	}
	return tokens.join(TITLE_SEPARATOR);
}

export function metaDescription(text: string, max = 155): string {
	const collapsed = text.replace(/\s+/g, " ").trim();
	if (collapsed.length <= max) {
		return collapsed;
	}
	const sliced = collapsed.slice(0, max);
	const lastSpace = sliced.lastIndexOf(" ");
	const cut = lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced;
	return `${cut.replace(/[\s.,;:]+$/u, "")}...`;
}
