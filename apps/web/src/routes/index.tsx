import { Button } from "@ibukos/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AreaRow } from "@/components/home/area-row";
import { HeroSearch } from "@/components/home/hero-search";
import { OwnerBanner } from "@/components/home/owner-banner";
import { PromoBanners } from "@/components/home/promo-banners";
import { ListingCard } from "@/components/search/listing-card";
import { createEmptyQuery } from "@/domain/facets/url";
import {
	getFeaturedListings,
	popularCampuses,
	popularCities,
} from "@/domain/kos/catalog";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	const featured = getFeaturedListings();

	return (
		<main className="flex flex-col">
			<HeroSearch />
			<div className="page-shell flex flex-col gap-8 py-8">
				<PromoBanners />
				<AreaRow tiles={popularCities} title="Kota populer" />
				<AreaRow tiles={popularCampuses} title="Dekat kampus" />
				<section className="flex flex-col gap-3">
					<div className="flex items-end justify-between gap-3">
						<h2 className="font-heading text-lg font-semibold tracking-tight">Kos pilihan</h2>
						<Button
							render={<Link search={createEmptyQuery()} to="/cari" />}
							size="sm"
							variant="outline"
						>
							Lihat semua
						</Button>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{featured.map((listing) => (
							<ListingCard key={listing.slug} listing={listing} />
						))}
					</div>
				</section>
				<OwnerBanner />
			</div>
		</main>
	);
}
