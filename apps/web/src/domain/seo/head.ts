import type { JsonLd } from "./schema";
import { jsonLdScript } from "./schema";
import {
	absoluteUrl,
	OG_IMAGE_HEIGHT,
	OG_IMAGE_TYPE,
	OG_IMAGE_WIDTH,
	ogImagePath,
	SITE_LOCALE,
	SITE_NAME,
	siteOrigin,
} from "./site";

export type SeoDocument = {
	title: string;
	description: string;
	path: string;
	image?: string;
	robots?: string;
	ogType?: "website" | "article" | "product";
	jsonLd?: JsonLd[];
};

export function seoHead(doc: SeoDocument, origin = siteOrigin()) {
	const canonical = absoluteUrl(doc.path, origin);
	const image = absoluteUrl(doc.image ?? ogImagePath(doc.path), origin);
	const robots = doc.robots ?? "index, follow";
	const ogType = doc.ogType ?? "website";

	return {
		meta: [
			{ title: doc.title },
			{ name: "description", content: doc.description },
			{ name: "robots", content: robots },
			{ name: "googlebot", content: robots },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:locale", content: SITE_LOCALE },
			{ property: "og:type", content: ogType },
			{ property: "og:title", content: doc.title },
			{ property: "og:description", content: doc.description },
			{ property: "og:url", content: canonical },
			{ property: "og:image", content: image },
			{ property: "og:image:alt", content: doc.title },
			{ property: "og:image:type", content: OG_IMAGE_TYPE },
			{ property: "og:image:width", content: OG_IMAGE_WIDTH },
			{ property: "og:image:height", content: OG_IMAGE_HEIGHT },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: doc.title },
			{ name: "twitter:description", content: doc.description },
			{ name: "twitter:image", content: image },
		],
		links: [{ rel: "canonical", href: canonical }],
		scripts: (doc.jsonLd ?? []).map(jsonLdScript),
	};
}
