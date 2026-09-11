import { createFileRoute } from "@tanstack/react-router";

import { CariWorkspace } from "@/components/cari/workspace";
import { parseSearchQuery } from "@/domain/facets/url";
import { getCatalog } from "@/domain/kos/catalog";
import { searchListings } from "@/domain/search/run";
import { seoHead } from "@/domain/seo/head";
import { searchDocument } from "@/domain/seo/pages";

export const Route = createFileRoute("/cari")({
	validateSearch: parseSearchQuery,
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ deps: { search } }) => searchListings(getCatalog(), search),
	head: ({ match }) => seoHead(searchDocument(match.search)),
	staticData: { chrome: { kind: "viewport" } },
	component: CariPage,
});

function CariPage() {
	const query = Route.useSearch();
	const result = Route.useLoaderData();
	const navigate = Route.useNavigate();

	return (
		<CariWorkspace
			onQueryChange={(search) => navigate({ to: "/cari", search })}
			query={query}
			result={result}
		/>
	);
}
