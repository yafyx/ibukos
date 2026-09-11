import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AreaGrid } from "@/components/home/area-grid";
import { FeatureAccordion } from "@/components/home/feature-accordion";
import { FeatureCards } from "@/components/home/feature-cards";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { HeroSearch } from "@/components/home/hero-search";
import {
	AreaGridSkeleton,
	FeaturedGridSkeleton,
	ListingRowSkeleton,
} from "@/components/home/home-skeletons";
import { ListingRow } from "@/components/home/listing-row";
import { OwnerBanner } from "@/components/home/owner-banner";
import { PromoBanners } from "@/components/home/promo-banners";
import { type HomePageData, loadHomePageData } from "@/domain/kos/home-data";
import { seoHead } from "@/domain/seo/head";
import { homeDocument } from "@/domain/seo/pages";

export const Route = createFileRoute("/")({
	loader: () => loadHomePageData(),
	head: () => seoHead(homeDocument()),
	pendingComponent: HomePagePending,
	component: HomePage,
});

function HomePageStaticShell({ children }: { children: ReactNode }) {
	return (
		<main className="flex flex-col" id="main" tabIndex={-1}>
			<HeroSearch />
			<div className="page-shell flex flex-col gap-8 py-8">
				<div className="flex flex-col gap-4">
					<PromoBanners />
					<OwnerBanner />
				</div>
				{children}
			</div>
		</main>
	);
}

function HomePagePending() {
	return (
		<HomePageStaticShell>
			<ListingRowSkeleton title="Kos yang lagi promo" />
			<FeaturedGridSkeleton />
			<AreaGridSkeleton title="Area Kos Terpopuler" variant="photo" />
			<FeatureCards />
			<AreaGridSkeleton
				className="campus-section -mx-4 px-4 py-6 sm:mx-0 sm:rounded-2xl sm:px-6 sm:py-8"
				title="Kos Sekitar Kampus"
				variant="campus"
			/>
		</HomePageStaticShell>
	);
}

function HomePageDynamicSections({ data }: { data: HomePageData }) {
	return (
		<>
			<ListingRow groups={data.promoByCity} title="Kos yang lagi promo" />
			<FeaturedGrid listings={data.featured} />
			<AreaGrid
				tiles={data.popularCities}
				title="Area Kos Terpopuler"
				variant="photo"
				viewAllQuery={{}}
			/>
			<FeatureCards />
			<FeatureAccordion />
			<AreaGrid
				className="campus-section -mx-4 px-4 py-6 sm:mx-0 sm:rounded-2xl sm:px-6 sm:py-8"
				tiles={data.popularCampuses}
				title="Kos Sekitar Kampus"
				variant="campus"
				viewAllQuery={{ sort: "recommended" }}
			/>
		</>
	);
}

function HomePage() {
	const data = Route.useLoaderData();

	return (
		<HomePageStaticShell>
			<HomePageDynamicSections data={data} />
		</HomePageStaticShell>
	);
}
