import { createFileRoute } from "@tanstack/react-router";

import { getListingBySlug } from "@/domain/kos/catalog";
import { listingOgCard } from "@/domain/seo/og-model";
import { ogImageResponse } from "@/domain/seo/og-response";

export const Route = createFileRoute("/og/kos/$slug")({
	server: {
		handlers: {
			GET: ({ params, request }) => {
				const listing = getListingBySlug(params.slug);
				if (!listing) {
					return new Response("Not found", { status: 404 });
				}
				return ogImageResponse(listingOgCard(listing), request.url);
			},
		},
	},
});
