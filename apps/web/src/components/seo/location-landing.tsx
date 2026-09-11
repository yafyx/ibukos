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
import { Button } from "@ibukos/ui/components/button";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ListingCard } from "@/components/search/listing-card";
import type { SearchQuery } from "@/domain/facets/types";
import { buildCariSearch, createEmptyQuery } from "@/domain/facets/url";
import type { CitySlug, Gender, KosListing } from "@/domain/kos/types";

export type LocationCrumb =
	| { label: string; to: "/" }
	| { label: string; to: "/cari"; search?: SearchQuery }
	| { label: string; to: "/kota/$city"; params: { city: CitySlug } }
	| {
			label: string;
			to: "/kota/$city/$gender";
			params: { city: CitySlug; gender: Gender };
	  }
	| { label: string; to: "/kampus/$slug"; params: { slug: string } }
	| { label: string; to: "/tipe/$gender"; params: { gender: Gender } };

export function LocationLanding({
	h1,
	intro,
	listings,
	crumbs,
	filterQuery,
	filterLabel = "Filter lebih lanjut",
	children,
}: {
	h1: string;
	intro: string;
	listings: KosListing[];
	crumbs: LocationCrumb[];
	filterQuery?: Partial<SearchQuery>;
	filterLabel?: string;
	children?: ReactNode;
}) {
	return (
		<main
			className="page-shell flex flex-col gap-8 py-8"
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
					{crumbs.map((crumb, index) => (
						<CrumbItem
							crumb={crumb}
							current={index === crumbs.length - 1}
							key={`${crumb.label}-${index}`}
						/>
					))}
				</BreadcrumbList>
			</Breadcrumb>

			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex max-w-2xl flex-col gap-2">
					<h1 className="text-pretty font-heading font-semibold text-3xl tracking-tight">
						{h1}
					</h1>
					<p className="text-pretty text-muted-foreground text-sm leading-relaxed sm:text-base">
						{intro}
					</p>
				</div>
				{filterQuery ? (
					<Button
						render={<Link search={buildCariSearch(filterQuery)} to="/cari" />}
						variant="outline"
					>
						{filterLabel}
					</Button>
				) : null}
			</header>

			{children}

			<section className="flex flex-col gap-4">
				<h2 className="font-heading font-semibold text-lg tracking-tight">
					{listings.length.toLocaleString("id-ID")} kos tersedia
				</h2>
				{listings.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						Belum ada listing di sini. Coba kota atau kampus lain.
					</p>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{listings.map((listing) => (
							<ListingCard key={listing.slug} listing={listing} />
						))}
					</div>
				)}
			</section>
		</main>
	);
}

function CrumbItem({
	crumb,
	current,
}: {
	crumb: LocationCrumb;
	current: boolean;
}) {
	return (
		<>
			<BreadcrumbSeparator>/</BreadcrumbSeparator>
			<BreadcrumbItem className={current ? "min-w-0" : undefined}>
				{current ? (
					<BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
				) : (
					<CrumbLink crumb={crumb} />
				)}
			</BreadcrumbItem>
		</>
	);
}

function CrumbLink({ crumb }: { crumb: LocationCrumb }) {
	if (crumb.to === "/") {
		return (
			<BreadcrumbLink render={<Link to="/" />}>{crumb.label}</BreadcrumbLink>
		);
	}
	if (crumb.to === "/cari") {
		return (
			<BreadcrumbLink
				render={<Link search={crumb.search ?? createEmptyQuery()} to="/cari" />}
			>
				{crumb.label}
			</BreadcrumbLink>
		);
	}
	if (crumb.to === "/kota/$city") {
		return (
			<BreadcrumbLink render={<Link params={crumb.params} to="/kota/$city" />}>
				{crumb.label}
			</BreadcrumbLink>
		);
	}
	if (crumb.to === "/kota/$city/$gender") {
		return (
			<BreadcrumbLink
				render={<Link params={crumb.params} to="/kota/$city/$gender" />}
			>
				{crumb.label}
			</BreadcrumbLink>
		);
	}
	if (crumb.to === "/kampus/$slug") {
		return (
			<BreadcrumbLink
				render={<Link params={crumb.params} to="/kampus/$slug" />}
			>
				{crumb.label}
			</BreadcrumbLink>
		);
	}
	return (
		<BreadcrumbLink render={<Link params={crumb.params} to="/tipe/$gender" />}>
			{crumb.label}
		</BreadcrumbLink>
	);
}
