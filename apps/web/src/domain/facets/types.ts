import type { CariView, MapBounds } from "../geo";
import type {
	BadgeId,
	CitySlug,
	Duration,
	FacilityId,
	Gender,
	RuleId,
	SortKey,
} from "../kos/types";

export type FacetId =
	| "q"
	| "city"
	| "gender"
	| "duration"
	| "price"
	| "facilities"
	| "rules"
	| "available"
	| "badges"
	| "sort"
	| "bounds";

export type SearchQuery = {
	q?: string;
	city?: CitySlug;
	gender?: Gender;
	duration?: Duration;
	priceMin?: number;
	priceMax?: number;
	facilities: FacilityId[];
	rules: RuleId[];
	availableOnly: boolean;
	badges: BadgeId[];
	sort: SortKey;
	bounds?: MapBounds;
	view: CariView;
};

export type ActiveChip = {
	facetId: FacetId;
	label: string;
	next: SearchQuery;
};

export type SearchResult = {
	items: import("../kos/types").KosListing[];
	total: number;
	chips: ActiveChip[];
};
