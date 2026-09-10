import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@ibukos/ui/components/breadcrumb";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { KosFacts } from "@/components/kos/facts";
import { PhotoCarousel } from "@/components/kos/photo-carousel";
import { ListingCard } from "@/components/search/listing-card";
import { createEmptyQuery } from "@/domain/facets/url";
import { cityLabels } from "@/domain/kos/labels";
import { getListingBySlug, getSimilarListings } from "@/domain/kos/catalog";

export const Route = createFileRoute("/kos/$slug")({
	loader: ({ params }) => {
		const listing = getListingBySlug(params.slug);
		if (!listing) {
			throw notFound();
		}
		return {
			listing,
			similar: getSimilarListings(params.slug),
		};
	},
	component: KosDetailPage,
});

function KosDetailPage() {
	const { listing, similar } = Route.useLoaderData();

	return (
		<main className="page-shell flex flex-col gap-8 py-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link to="/" />}>Beranda</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link search={createEmptyQuery()} to="/cari" />}>
							Cari kos
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{listing.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<PhotoCarousel alt={listing.name} photos={listing.photos} />
			<KosFacts listing={listing} />

			{similar.length > 0 ? (
				<section className="flex flex-col gap-3">
					<h2 className="font-heading text-lg font-semibold tracking-tight">
						Kos serupa di {cityLabels[listing.city]}
					</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{similar.map((item) => (
							<ListingCard key={item.slug} listing={item} />
						))}
					</div>
				</section>
			) : null}
		</main>
	);
}
