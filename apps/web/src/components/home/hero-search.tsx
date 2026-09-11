"use client";

import { Button } from "@ibukos/ui/components/button";
import { Group, GroupSeparator } from "@ibukos/ui/components/group";
import { Link } from "@tanstack/react-router";
import { Fragment, useRef } from "react";

import {
	LocationSearchSlot,
	useHeroSearchSentinel,
} from "@/components/search/search-dock";
import { buildCariSearch } from "@/domain/facets/url";
import { popularCities } from "@/domain/kos/catalog";
import { parseCitySlug } from "@/domain/seo/locations";
import { pressable } from "@/lib/motion";

export function HeroSearch() {
	const cities = popularCities.slice(0, 5);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const heroVisible = useHeroSearchSentinel(sentinelRef);

	return (
		<section className="relative overflow-hidden border-b bg-primary/[0.04]">
			<CitySkyline />
			<div className="page-shell relative flex flex-col items-start gap-4 py-8 sm:py-16">
				<div className="flex max-w-xl flex-col gap-2">
					<h1 className="text-pretty font-heading font-semibold text-3xl leading-tight tracking-tight sm:text-4xl">
						Mau cari kos?
					</h1>
					<p className="text-muted-foreground text-sm sm:text-base">
						Dapatkan infonya dan langsung sewa di Ibukos.
					</p>
				</div>
				<div className="w-full max-w-xl" ref={sentinelRef}>
					{heroVisible ? (
						<LocationSearchSlot size="hero" />
					) : (
						<div aria-hidden="true" className="h-12" />
					)}
				</div>

				<nav
					aria-label="Area kos terpopuler"
					className="flex w-full max-w-xl snap-x gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden"
				>
					{cities.map((city) => (
						<CityChip
							className={`shrink-0 snap-start whitespace-nowrap rounded-full border border-border bg-background px-4 py-2 font-medium text-sm ${pressable}`}
							key={city.slug}
							label={city.label}
							slug={city.slug}
						/>
					))}
				</nav>

				{/* Desktop: joined button group */}
				<Group aria-label="Area kos terpopuler" className="hidden sm:flex">
					{cities.map((city, index) => (
						<Fragment key={city.slug}>
							{index > 0 ? <GroupSeparator /> : null}
							<Button
								render={<CityLink slug={city.slug} />}
								size="sm"
								variant="outline"
							>
								{city.label}
							</Button>
						</Fragment>
					))}
				</Group>
			</div>
		</section>
	);
}

function CityChip({
	slug,
	label,
	className,
}: {
	slug: string;
	label: string;
	className?: string;
}) {
	const city = parseCitySlug(slug);
	if (city) {
		return (
			<Link className={className} params={{ city }} to="/kota/$city">
				{label}
			</Link>
		);
	}
	return (
		<Link
			className={className}
			search={buildCariSearch({ q: label })}
			to="/cari"
		>
			{label}
		</Link>
	);
}

function CityLink({ slug }: { slug: string }) {
	const city = parseCitySlug(slug);
	if (city) {
		return <Link params={{ city }} to="/kota/$city" />;
	}
	return <Link search={buildCariSearch({ q: slug })} to="/cari" />;
}

function CitySkyline() {
	return (
		<svg
			aria-hidden="true"
			className="pointer-events-none absolute end-0 bottom-0 hidden h-40 w-[min(52vw,28rem)] text-primary/25 md:block"
			fill="none"
			viewBox="0 0 480 160"
		>
			<path
				d="M20 160 V92 h28 v68 M56 160 V70 h18 V48 h18 v112 M118 160 V84 h40 v76 M168 160 V40 h12 V22 h12 v18 h12 v120 M220 160 V96 h36 v64 M268 160 V58 h22 v-18 h22 v18 h22 v102 M348 160 V88 h48 v72 M408 160 V72 h52 v88"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
}
