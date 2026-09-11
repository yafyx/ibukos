"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "@ibukos/ui/components/button";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { SectionHeader } from "@/components/home/section-header";
import { ListingCard } from "@/components/search/listing-card";
import { createEmptyQuery } from "@/domain/facets/url";
import type { KosListing } from "@/domain/kos/types";

export function FeaturedGrid({ listings }: { listings: KosListing[] }) {
	const teaseCount = listings.length >= 4 ? 2 : 0;
	const visible = listings.slice(0, listings.length - teaseCount);
	const teased = listings.slice(listings.length - teaseCount);

	return (
		<section className="flex flex-col gap-4">
			<SectionHeader title="Rekomendasi kos" />
			<div className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-3 xl:grid-cols-4">
				{visible.map((listing) => (
					<ListingCard key={listing.slug} listing={listing} />
				))}
				{teased.length > 0 ? (
					<div className="relative isolate col-span-2">
						<div className="grid h-full grid-cols-2 gap-4">
							{teased.map((listing) => (
								<div
									className="featured-tease-card pointer-events-none select-none"
									inert
									key={listing.slug}
								>
									<ListingCard listing={listing} />
								</div>
							))}
						</div>
						<Link
							aria-label="Lihat semua rekomendasi kos"
							className="group/tease absolute inset-0 z-20 flex items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
							search={createEmptyQuery()}
							to="/cari"
						>
							<span
								aria-hidden="true"
								className="featured-tease-mask absolute -inset-px z-0"
							/>
							<span
								className={cn(
									buttonVariants({ size: "lg" }),
									"relative z-10 shadow-sm transition-transform duration-[160ms] ease-[var(--ease-out)] group-active/tease:scale-[0.97] motion-reduce:transition-none motion-reduce:group-active/tease:scale-100",
								)}
							>
								Lihat semua
								<HugeiconsIcon
									aria-hidden="true"
									className="see-all-tile__arrow size-4"
									icon={ArrowRight01Icon}
								/>
							</span>
						</Link>
					</div>
				) : null}
			</div>
		</section>
	);
}
