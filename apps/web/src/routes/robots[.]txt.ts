import { createFileRoute } from "@tanstack/react-router";

import { robotsTxt } from "@/domain/seo/sitemap";

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: ({ request }) =>
				new Response(robotsTxt(request.url), {
					headers: {
						"Content-Type": "text/plain; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
					},
				}),
		},
	},
});
