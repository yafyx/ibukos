"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { SectionHeader } from "@/components/home/section-header";
import { KosImage } from "@/components/media/kos-image";
import type { SearchQuery } from "@/domain/facets/types";
import { buildCariSearch } from "@/domain/facets/url";
import type { AreaTile } from "@/domain/kos/types";
import { campusBySlug, parseCitySlug } from "@/domain/seo/locations";
import { pressable } from "@/lib/motion";

function mosaicSpan(index: number, total: number) {
	const top = Math.ceil(total / 2);
	const inTop = index < top;
	const count = inTop ? top : total - top;
	const base = Math.floor(12 / count);
	const extra = 12 - base * count;
	const offset = inTop ? index : index - top;

	return base + (offset < extra ? 1 : 0);
}

function SeeAllTile({
	tiles,
	viewAllQuery,
	variant,
}: {
	tiles: AreaTile[];
	viewAllQuery: Partial<SearchQuery>;
	variant: "photo" | "campus";
}) {
	if (variant === "campus") {
		return (
			<Link
				className={cn(
					"campus-see-all group flex min-h-28 flex-col items-center justify-center gap-1 rounded-xl px-3 py-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					pressable,
				)}
				search={buildCariSearch(viewAllQuery)}
				to="/cari"
			>
				<span className="font-heading font-semibold text-sm tracking-tight">
					Lihat semua
				</span>
				<HugeiconsIcon
					aria-hidden="true"
					className="campus-see-all__arrow size-4 text-primary"
					icon={ArrowRight01Icon}
				/>
			</Link>
		);
	}

	return (
		<Link
			className={cn(
				"see-all-tile group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-xl text-center text-white outline outline-1 outline-black/10 -outline-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:outline-white/10",
				pressable,
			)}
			search={buildCariSearch(viewAllQuery)}
			to="/cari"
		>
			<span
				aria-hidden="true"
				className="see-all-tile__mosaic absolute inset-0 grid grid-cols-12 grid-rows-2 gap-px bg-black/20"
			>
				{tiles.map((tile, index) => (
					<span
						className="block h-full min-h-0 overflow-hidden"
						key={tile.slug}
						style={{ gridColumn: `span ${mosaicSpan(index, tiles.length)}` }}
					>
						<KosImage
							alt=""
							className="size-full object-cover"
							height={90}
							src={tile.image}
							width={120}
						/>
					</span>
				))}
			</span>
			<span
				aria-hidden="true"
				className="see-all-tile__scrim absolute inset-0 bg-black/45"
			/>
			<span className="relative z-10 inline-flex items-center gap-1 rounded-lg bg-background/95 px-2.5 py-1.5 font-heading font-semibold text-foreground text-sm shadow-sm">
				Lihat semua
				<HugeiconsIcon
					aria-hidden="true"
					className="see-all-tile__arrow size-4"
					icon={ArrowRight01Icon}
				/>
			</span>
		</Link>
	);
}

function PhotoTile({ tile }: { tile: AreaTile }) {
	const city = parseCitySlug(tile.slug);
	const className = cn(
		"area-photo-tile group relative block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
		pressable,
	);
	const body = (
		<>
			<KosImage
				alt={`Kos di ${tile.label}`}
				className="area-photo-tile__img aspect-[4/3] size-full object-cover outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10"
				height={180}
				src={tile.image}
				width={240}
			/>
			<span
				aria-hidden="true"
				className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent transition-opacity duration-200 ease-[var(--ease-out)] group-hover:from-black/60"
			/>
			<span className="absolute inset-x-3 bottom-3">
				<span className="block font-heading font-semibold text-sm text-white tracking-tight">
					{tile.label}
				</span>
			</span>
		</>
	);
	if (city) {
		return (
			<Link
				aria-label={`Kos di ${tile.label}`}
				className={className}
				params={{ city }}
				to="/kota/$city"
			>
				{body}
			</Link>
		);
	}
	return (
		<Link
			aria-label={`Kos di ${tile.label}`}
			className={className}
			search={buildCariSearch(tile.query)}
			to="/cari"
		>
			{body}
		</Link>
	);
}

function CampusTile({ tile }: { tile: AreaTile }) {
	const landing = campusBySlug(tile.slug);
	const className = cn(
		"campus-tile group flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-3 sm:py-4",
		pressable,
	);
	const body = (
		<>
			<span
				aria-hidden="true"
				className="campus-tile__logo flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-[0_1px_2px_oklch(0_0_0/0.06),0_4px_12px_-2px_oklch(0_0_0/0.08)] ring-1 ring-black/[0.04] sm:size-[4.5rem] dark:bg-white/95 dark:ring-white/10"
			>
				<KosImage
					alt=""
					aria-hidden="true"
					className="size-full object-contain"
					height={56}
					src={tile.image}
					width={56}
				/>
			</span>
			<span className="flex min-w-0 flex-col gap-0.5">
				<span className="block font-heading font-semibold text-xs tracking-tight sm:text-sm">
					{tile.label}
				</span>
				{tile.subtitle ? (
					<span className="block text-muted-foreground text-xs">
						{tile.subtitle}
					</span>
				) : null}
			</span>
		</>
	);
	if (landing && landing.listings.length > 0) {
		return (
			<Link
				aria-label={`Kos sekitar ${tile.label}${tile.subtitle ? `, ${tile.subtitle}` : ""}`}
				className={className}
				params={{ slug: landing.slug }}
				to="/kampus/$slug"
			>
				{body}
			</Link>
		);
	}
	return (
		<Link
			aria-label={`Kos sekitar ${tile.label}${tile.subtitle ? `, ${tile.subtitle}` : ""}`}
			className={className}
			search={buildCariSearch(tile.query)}
			to="/cari"
		>
			{body}
		</Link>
	);
}

export function AreaGrid({
	title,
	tiles,
	variant,
	viewAllQuery,
	className,
}: {
	title: string;
	tiles: AreaTile[];
	variant: "photo" | "campus";
	viewAllQuery?: Partial<SearchQuery>;
	className?: string;
}) {
	const gridTiles = tiles.slice(0, 7);

	return (
		<section className={cn("flex flex-col gap-4", className)}>
			<SectionHeader title={title} />
			<div
				className={cn(
					"grid-stagger grid gap-2 sm:gap-4",
					variant === "photo" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-4",
				)}
			>
				{gridTiles.map((tile) =>
					variant === "photo" ? (
						<PhotoTile key={tile.slug} tile={tile} />
					) : (
						<CampusTile key={tile.slug} tile={tile} />
					),
				)}
				{viewAllQuery ? (
					<SeeAllTile
						tiles={tiles}
						variant={variant}
						viewAllQuery={viewAllQuery}
					/>
				) : null}
			</div>
		</section>
	);
}
