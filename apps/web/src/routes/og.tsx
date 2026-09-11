import { createFileRoute } from "@tanstack/react-router";

import { homeOgCard } from "@/domain/seo/og-model";
import { ogImageResponse } from "@/domain/seo/og-response";

export const Route = createFileRoute("/og")({
	server: {
		handlers: {
			GET: ({ request }) => ogImageResponse(homeOgCard(), request.url),
		},
	},
});
