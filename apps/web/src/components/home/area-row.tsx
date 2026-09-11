"use client";

import { Button } from "@ibukos/ui/components/button";
import { Link } from "@tanstack/react-router";

import { HorizontalScrollRow } from "@/components/home/horizontal-scroll-row";
import { SectionHeader } from "@/components/home/section-header";
import { KosImage } from "@/components/media/kos-image";
import type { SearchQuery } from "@/domain/facets/types";
import { buildCariSearch } from "@/domain/facets/url";
import type { AreaTile } from "@/domain/kos/types";
import { pressable } from "@/lib/motion";

export function AreaRow({
	title,
	tiles,
	viewAllQuery,
}: {
	title: string;
	tiles: AreaTile[];
	viewAllQuery?: Partial<SearchQuery>;
}) {
	return (
		<section className="flex flex-col gap-3">
			<SectionHeader
				action={
					viewAllQuery ? (
						<Button
							render={
								<Link search={buildCariSearch(viewAllQuery)} to="/cari" />
							}
							size="sm"
							variant="ghost"
						>
							Lihat semua
						</Button>
					) : undefined
				}
				title={title}
			/>
			<HorizontalScrollRow gapClassName="gap-3" maskHeight={40}>
				{tiles.map((tile) => (
					<Link
						aria-label={`Cari kos di ${tile.label}`}
						className={`relative w-40 shrink-0 snap-start overflow-hidden rounded-xl p-0.5 sm:w-52 ${pressable}`}
						data-scroll-item=""
						key={tile.slug}
						search={buildCariSearch(tile.query)}
						to="/cari"
					>
						<span className="relative block overflow-hidden rounded-[calc(var(--radius-xl)-2px)]">
							<KosImage
								alt=""
								aria-hidden="true"
								className="aspect-[4/3] size-full object-cover outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10"
								height={156}
								src={tile.image}
								width={208}
							/>
							<span
								aria-hidden="true"
								className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent"
							/>
							<span className="absolute inset-e-3 inset-s-3 bottom-3 font-medium text-sm text-white">
								{tile.label}
							</span>
						</span>
					</Link>
				))}
			</HorizontalScrollRow>
		</section>
	);
}
