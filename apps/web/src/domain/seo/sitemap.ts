import { CITIES, GENDERS } from "@/domain/facets/definitions";
import { getCatalog } from "@/domain/kos/catalog";
import {
	allCampusLandings,
	campusPath,
	cityListings,
	cityPath,
	genderCityListings,
	genderPath,
	tipePath,
} from "./locations";
import { absoluteUrl, siteOrigin } from "./site";

export type SitemapUrl = {
	path: string;
	changefreq: "daily" | "weekly" | "monthly";
	priority: string;
};

export function sitemapEntries(): SitemapUrl[] {
	const urls: SitemapUrl[] = [
		{ path: "/", changefreq: "daily", priority: "1.0" },
		{ path: "/cari", changefreq: "daily", priority: "0.8" },
	];

	for (const gender of GENDERS) {
		urls.push({
			path: tipePath(gender),
			changefreq: "weekly",
			priority: "0.7",
		});
	}

	for (const city of CITIES) {
		if (cityListings(city).length === 0) {
			continue;
		}
		urls.push({
			path: cityPath(city),
			changefreq: "daily",
			priority: "0.9",
		});
		for (const gender of GENDERS) {
			if (genderCityListings(city, gender).length === 0) {
				continue;
			}
			urls.push({
				path: genderPath(city, gender),
				changefreq: "weekly",
				priority: "0.7",
			});
		}
	}

	for (const campus of allCampusLandings()) {
		if (campus.listings.length === 0) {
			continue;
		}
		urls.push({
			path: campusPath(campus.slug),
			changefreq: "weekly",
			priority: "0.8",
		});
	}

	for (const listing of getCatalog()) {
		urls.push({
			path: `/kos/${listing.slug}`,
			changefreq: "weekly",
			priority: "0.6",
		});
	}

	return urls;
}

export function sitemapXml(requestUrl?: string): string {
	const origin = siteOrigin(requestUrl);
	const body = sitemapEntries()
		.map((entry) => {
			const loc = absoluteUrl(entry.path, origin);
			return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function robotsTxt(requestUrl?: string): string {
	const origin = siteOrigin(requestUrl);
	const sitemap = absoluteUrl("/sitemap.xml", origin);
	return `User-agent: *
Allow: /
Disallow: /login
Disallow: /dashboard
Disallow: /api/

Sitemap: ${sitemap}
`;
}

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}
