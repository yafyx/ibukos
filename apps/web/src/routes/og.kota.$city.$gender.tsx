import { createFileRoute } from "@tanstack/react-router";

import {
	genderCityListings,
	parseCitySlug,
	parseGender,
} from "@/domain/seo/locations";
import { genderCityOgCard } from "@/domain/seo/og-model";
import { ogImageResponse } from "@/domain/seo/og-response";

export const Route = createFileRoute("/og/kota/$city/$gender")({
	server: {
		handlers: {
			GET: ({ params, request }) => {
				const city = parseCitySlug(params.city);
				const gender = parseGender(params.gender);
				if (!city || !gender || genderCityListings(city, gender).length === 0) {
					return new Response("Not found", { status: 404 });
				}
				return ogImageResponse(genderCityOgCard(city, gender), request.url);
			},
		},
	},
});
