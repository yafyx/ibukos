"use client";

import { Button } from "@ibukos/ui/components/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ibukos/ui/components/tabs";
import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { memo, type RefObject, useCallback, useRef, useState } from "react";

import { FolderNotch } from "@/components/home/folder-notch";
import {
	HorizontalScrollRow,
	type HorizontalScrollRowHandle,
	type HorizontalScrollState,
} from "@/components/home/horizontal-scroll-row";
import { SectionHeader } from "@/components/home/section-header";
import { ListingCard } from "@/components/search/listing-card";
import { buildCariSearch } from "@/domain/facets/url";
import { cityLabels } from "@/domain/kos/labels";
import type { CitySlug, KosListing, PromoCityGroup } from "@/domain/kos/types";

const folderMaskClassName =
	"z-20 before:from-muted before:via-muted/80 after:from-muted after:via-muted/80";

export function ListingRow({
	groups,
	title,
}: {
	groups: PromoCityGroup[];
	title: string;
}) {
	const scrollRef = useRef<HorizontalScrollRowHandle>(null);
	const [city, setCity] = useState<CitySlug | null>(null);
	const [canScroll, setCanScroll] = useState({
		prev: false,
		next: false,
	});

	const handleScrollStateChange = useCallback(
		(state: HorizontalScrollState) => {
			setCanScroll((current) => {
				if (
					current.prev === state.canScrollPrev &&
					current.next === state.canScrollNext
				) {
					return current;
				}
				return {
					prev: state.canScrollPrev,
					next: state.canScrollNext,
				};
			});
		},
		[],
	);

	const current = groups.find((group) => group.city === city) ?? groups[0];

	if (!current) {
		return null;
	}

	return (
		<section
			aria-labelledby="promo-by-city-heading"
			className="flex flex-col gap-4"
		>
			<SectionHeader
				action={
					<div className="flex items-center gap-2">
						<Button
							aria-label="Geser ke kiri"
							className="hidden sm:inline-flex"
							disabled={!canScroll.prev}
							onClick={() => scrollRef.current?.scrollPrev()}
							size="icon-sm"
							variant="outline"
						>
							<ChevronLeftIcon aria-hidden="true" />
						</Button>
						<Button
							aria-label="Geser ke kanan"
							className="hidden sm:inline-flex"
							disabled={!canScroll.next}
							onClick={() => scrollRef.current?.scrollNext()}
							size="icon-sm"
							variant="outline"
						>
							<ChevronRightIcon aria-hidden="true" />
						</Button>
						<Button
							render={
								<Link
									search={buildCariSearch({
										badges: ["promo"],
										city: current.city,
									})}
									to="/cari"
								/>
							}
							size="sm"
							variant="outline"
						>
							Lihat semua
						</Button>
					</div>
				}
				id="promo-by-city-heading"
				title={title}
			/>
			<Tabs
				className="promo-folder gap-0"
				onValueChange={(value) => {
					const next = groups.find((group) => group.city === value);
					if (next) {
						setCity(next.city);
					}
				}}
				value={current.city}
			>
				<TabsList
					className="promo-folder-nav z-10 gap-x-[46px] bg-transparent p-0 [&_[data-slot=tab-indicator]]:hidden"
					size="sm"
				>
					{groups.map((group) => (
						<FolderNotch active={group.city === current.city} key={group.city}>
							<TabsTab className="hover:bg-transparent" value={group.city}>
								{cityLabels[group.city]}
							</TabsTab>
						</FolderNotch>
					))}
				</TabsList>
				<div className="promo-folder-body">
					<TabsPanel value={current.city}>
						<ListingRowScroller
							key={current.city}
							listings={current.listings}
							maskClassName={folderMaskClassName}
							onScrollStateChange={handleScrollStateChange}
							scrollRef={scrollRef}
						/>
					</TabsPanel>
				</div>
			</Tabs>
		</section>
	);
}

const ListingRowScroller = memo(function ListingRowScroller({
	listings,
	maskClassName,
	onScrollStateChange,
	scrollRef,
}: {
	listings: KosListing[];
	maskClassName?: string;
	onScrollStateChange: (state: HorizontalScrollState) => void;
	scrollRef: RefObject<HorizontalScrollRowHandle | null>;
}) {
	return (
		<HorizontalScrollRow
			edgeToEdge={false}
			maskClassName={maskClassName}
			maskHeight={56}
			onScrollStateChange={onScrollStateChange}
			ref={scrollRef}
		>
			{listings.map((listing) => (
				<div
					className="w-[min(17rem,78vw)] shrink-0 snap-start p-0.5 sm:w-72"
					data-scroll-item=""
					key={listing.slug}
				>
					<ListingCard listing={listing} />
				</div>
			))}
		</HorizontalScrollRow>
	);
});
