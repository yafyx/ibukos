import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ibukos/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@ibukos/ui/components/empty";
import { createFileRoute, Link } from "@tanstack/react-router";

import { FilterBar } from "@/components/search/filter-bar";
import { FilterChips } from "@/components/search/filter-chips";
import { ListingCard } from "@/components/search/listing-card";
import { createEmptyQuery, parseSearchQuery } from "@/domain/facets/url";
import { getCatalog } from "@/domain/kos/catalog";
import { searchListings } from "@/domain/search/run";

export const Route = createFileRoute("/cari")({
	validateSearch: parseSearchQuery,
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ deps: { search } }) => searchListings(getCatalog(), search),
	component: CariPage,
});

function CariPage() {
	const search = Route.useSearch();
	const result = Route.useLoaderData();

	return (
		<main>
			<div className="sticky top-14 z-30 border-b bg-background/95 backdrop-blur-sm">
				<div className="page-shell flex flex-col gap-3 py-3">
					<FilterBar query={search} />
					<FilterChips chips={result.chips} />
				</div>
			</div>
			<div className="page-shell flex flex-col gap-4 py-5">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading font-semibold text-lg tracking-tight">
						Cari kos
					</h1>
					<p className="text-muted-foreground text-sm">
						{result.total} kos ditemukan
						{search.q ? ` untuk “${search.q}”` : ""}
					</p>
				</div>

				{result.items.length === 0 ? (
					<Empty className="border border-dashed">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<HugeiconsIcon aria-hidden="true" icon={Search01Icon} />
							</EmptyMedia>
							<EmptyTitle>Kos tidak ditemukan</EmptyTitle>
							<EmptyDescription>
								Ubah filter atau cari di lokasi lain.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								render={<Link search={createEmptyQuery()} to="/cari" />}
								size="sm"
							>
								Hapus filter
							</Button>
						</EmptyContent>
					</Empty>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{result.items.map((listing) => (
							<ListingCard key={listing.slug} listing={listing} />
						))}
					</div>
				)}
			</div>
		</main>
	);
}
