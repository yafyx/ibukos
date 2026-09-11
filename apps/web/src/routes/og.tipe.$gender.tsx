import { createFileRoute } from "@tanstack/react-router";

import { parseGender, tipeListings } from "@/domain/seo/locations";
import { tipeOgCard } from "@/domain/seo/og-model";
import { ogImageResponse } from "@/domain/seo/og-response";

export const Route = createFileRoute("/og/tipe/$gender")({
	server: {
		handlers: {
			GET: ({ params }) => {
				const gender = parseGender(params.gender);
				if (!gender || tipeListings(gender).length === 0) {
					return new Response("Not found", { status: 404 });
				}
				return ogImageResponse(tipeOgCard(gender));
			},
		},
	},
});
