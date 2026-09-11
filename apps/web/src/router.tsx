import {
	createRouter as createTanStackRouter,
	defaultStringifySearch,
} from "@tanstack/react-router";
import { NotFoundPage } from "./components/chrome/not-found-page";
import { parseSearchQuery, serializeSearchQuery } from "./domain/facets/url";
import { routeTree } from "./routeTree.gen";

function stringifySearch(search: Record<string, unknown>): string {
	if (
		Array.isArray(search.facilities) &&
		typeof search.sort === "string" &&
		(search.view === "split" ||
			search.view === "daftar" ||
			search.view === "peta")
	) {
		const params = serializeSearchQuery(parseSearchQuery(search));
		const query = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== "") {
				query.set(key, value);
			}
		}
		const encoded = query.toString();
		return encoded ? `?${encoded}` : "";
	}
	return defaultStringifySearch(search);
}

export const getRouter = () => {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		stringifySearch,
		context: {},
		defaultNotFoundComponent: NotFoundPage,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
