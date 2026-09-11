import { createFileRoute } from "@tanstack/react-router";

import { sitemapXml } from "@/domain/seo/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: ({ request }) =>
				new Response(sitemapXml(request.url), {
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
					},
				}),
		},
	},
});
