import {
	buildActiveChips,
	listingMatchesQuery,
	sortListings,
} from "../facets/definitions";
import type { SearchQuery, SearchResult } from "../facets/types";
import type { KosListing } from "../kos/types";

export function searchListings(
	listings: readonly KosListing[],
	query: SearchQuery,
): SearchResult {
	const filtered = listings.filter((listing) => listingMatchesQuery(listing, query));
	const items = sortListings(filtered, query.sort);

	return {
		items,
		total: items.length,
		chips: buildActiveChips(query),
	};
}
