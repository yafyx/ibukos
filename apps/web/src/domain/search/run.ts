import {
	buildActiveChips,
	listingMatchesQuery,
	sortListings,
} from "../facets/definitions";
import type { SearchQuery, SearchResult } from "../facets/types";
import { boundsContain } from "../geo";
import { listingCoords } from "../kos/labels";
import type { KosListing } from "../kos/types";

export function searchListings(
	listings: readonly KosListing[],
	query: SearchQuery,
): SearchResult {
	const matched = listings.filter((listing) =>
		listingMatchesQuery(listing, query),
	);
	const area = query.bounds;
	const inArea = area
		? matched.filter((listing) =>
				boundsContain(area, listingCoords(listing.slug, listing.city)),
			)
		: matched;
	const items = sortListings(inArea, query.sort);

	return {
		items,
		total: items.length,
		chips: buildActiveChips(query),
	};
}
