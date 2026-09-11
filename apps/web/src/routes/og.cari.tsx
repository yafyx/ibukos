import { createFileRoute } from "@tanstack/react-router";

import { searchOgCard } from "@/domain/seo/og-model";
import { ogImageResponse } from "@/domain/seo/og-response";

export const Route = createFileRoute("/og/cari")({
	server: {
		handlers: {
			GET: () => ogImageResponse(searchOgCard()),
		},
	},
});
