"use client";

import { Button } from "@ibukos/ui/components/button";
import { Group, GroupSeparator } from "@ibukos/ui/components/group";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

import { LocationSearch } from "@/components/search/location-search";
import { buildCariSearch } from "@/domain/facets/url";
import { popularCities } from "@/domain/kos/catalog";

export function HeroSearch() {
	const cities = popularCities.slice(0, 5);

	return (
		<section className="relative overflow-hidden border-b bg-primary/[0.04]">
			<CitySkyline />
			<div className="page-shell relative flex flex-col items-start gap-4 py-10 sm:py-14">
				<div className="flex max-w-xl flex-col gap-1">
					<h1 className="text-pretty font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
						Mau cari kos?
					</h1>
					<p className="text-muted-foreground">
						Dapatkan infonya dan langsung sewa di Ibukos.
					</p>
				</div>
				<LocationSearch size="hero" />
				<Group aria-label="Kota populer">
					{cities.map((city, index) => (
						<Fragment key={city.slug}>
							{index > 0 ? <GroupSeparator /> : null}
							<Button
								render={
									<Link search={buildCariSearch(city.query)} to="/cari" />
								}
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
