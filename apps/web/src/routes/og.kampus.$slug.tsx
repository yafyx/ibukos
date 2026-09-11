import { createFileRoute } from "@tanstack/react-router";

import { campusBySlug } from "@/domain/seo/locations";
import { campusOgCard } from "@/domain/seo/og-model";
import { ogImageResponse } from "@/domain/seo/og-response";

export const Route = createFileRoute("/og/kampus/$slug")({
	server: {
		handlers: {
			GET: ({ params }) => {
				const campus = campusBySlug(params.slug);
				if (!campus || campus.listings.length === 0) {
					return new Response("Not found", { status: 404 });
				}
				return ogImageResponse(campusOgCard(campus));
			},
		},
	},
});
