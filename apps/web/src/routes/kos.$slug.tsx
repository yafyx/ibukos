import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@ibukos/ui/components/breadcrumb";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { KosDetailView } from "@/components/kos/detail-view";
import { createEmptyQuery } from "@/domain/facets/url";
import { getListingBySlug, getSimilarListings } from "@/domain/kos/catalog";
import { seoHead } from "@/domain/seo/head";
import { listingDocument } from "@/domain/seo/pages";

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
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {};
		}
		return seoHead(listingDocument(loaderData.listing));
	},
	component: KosDetailPage,
});

function KosDetailPage() {
	const { listing, similar } = Route.useLoaderData();

	return (
		<main
			className="page-shell flex flex-col gap-8 py-8 pb-28 lg:pb-8"
			id="main"
			tabIndex={-1}
		>
			<Breadcrumb>
				<BreadcrumbList className="flex-nowrap gap-2 overflow-hidden">
					<BreadcrumbItem>
						<BreadcrumbLink
							aria-label="Beranda"
							className="inline-flex items-center"
							render={<Link to="/" />}
						>
							<HugeiconsIcon
								aria-hidden="true"
								className="size-4"
								icon={Home01Icon}
								strokeWidth={1.5}
							/>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>/</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbLink
							render={<Link search={createEmptyQuery()} to="/cari" />}
						>
							Cari kos
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>/</BreadcrumbSeparator>
					<BreadcrumbItem className="min-w-0">
						<BreadcrumbPage className="truncate">{listing.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<KosDetailView listing={listing} similar={similar} />
		</main>
	);
}
