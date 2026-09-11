import {
	getFeaturedListings,
	getPromoListingsByCity,
	popularCampuses,
	popularCities,
} from "@/domain/kos/catalog";
import type { AreaTile, KosListing, PromoCityGroup } from "@/domain/kos/types";

export type HomePageData = {
	featured: KosListing[];
	promoByCity: PromoCityGroup[];
	popularCities: AreaTile[];
	popularCampuses: AreaTile[];
};

export async function loadHomePageData(): Promise<HomePageData> {
	return {
		featured: getFeaturedListings(),
		promoByCity: getPromoListingsByCity(),
		popularCities,
		popularCampuses,
	};
}
