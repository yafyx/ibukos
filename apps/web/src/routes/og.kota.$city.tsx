import { createFileRoute } from "@tanstack/react-router";

import { cityListings, parseCitySlug } from "@/domain/seo/locations";
import { cityOgCard } from "@/domain/seo/og-model";
import { ogImageResponse } from "@/domain/seo/og-response";

export const Route = createFileRoute("/og/kota/$city")({
	server: {
		handlers: {
			GET: ({ params, request }) => {
				const city = parseCitySlug(params.city);
				if (!city || cityListings(city).length === 0) {
					return new Response("Not found", { status: 404 });
				}
				return ogImageResponse(cityOgCard(city), request.url);
			},
		},
	},
});
