"use client";

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
import { ScrollArea } from "@ibukos/ui/components/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ibukos/ui/components/select";
import { Tabs, TabsList, TabsTab } from "@ibukos/ui/components/tabs";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import {
	addTransitionType,
	startTransition,
	useEffect,
	useReducer,
	useRef,
	useState,
	ViewTransition,
} from "react";

import { MapIsland } from "@/components/cari/map-island";
import { FilterBar } from "@/components/search/filter-bar";
import { FilterChips } from "@/components/search/filter-chips";
import { ListingCard } from "@/components/search/listing-card";
import {
	type HighlightEvent,
	highlightNone,
	highlightSlug,
	reduceHighlight,
} from "@/domain/cari/highlight";
import { realizeCariLayout } from "@/domain/cari/layout";
import { SORT_KEYS } from "@/domain/facets/definitions";
import type { SearchQuery, SearchResult } from "@/domain/facets/types";
import { createEmptyQuery } from "@/domain/facets/url";
import {
	type CariView,
	commitMapArea,
	type MapBounds,
	mapFitFromQuery,
	type PlacedListing,
	placeListings,
	withCariView,
} from "@/domain/geo";
import { sortLabels } from "@/domain/kos/labels";
import { searchHeading } from "@/domain/seo/search-index";
import { prefersReducedMotion } from "@/lib/motion";

const listFadeMaskClassName =
	"z-20 before:from-background before:via-background/80 after:from-background after:via-background/80";

const VIEW_OPTIONS: readonly { view: CariView; label: string }[] = [
	{ view: "daftar", label: "Daftar" },
	{ view: "split", label: "Gabungan" },
	{ view: "peta", label: "Peta" },
];

const MOBILE_VIEW_OPTIONS = VIEW_OPTIONS.filter(
	(option) => option.view !== "split",
);

const cariViewType = "cari-view";
const cariViewLayout = {
	"cari-view": "layout",
	default: "none",
} as const;

export function CariWorkspace({
	query,
	result,
	onQueryChange,
}: {
	query: SearchQuery;
	result: SearchResult;
	onQueryChange: (next: SearchQuery) => void;
}) {
	const placed = placeListings(result.items);
	const fit = mapFitFromQuery(query, placed);
	const [highlight, dispatchHighlight] = useReducer(
		reduceHighlight,
		highlightNone,
	);
	const rowRefs = useRef(new Map<string, HTMLElement>());
	const selected = placed.find(
		(item) => highlightSlug(highlight) === item.listing.slug,
	);
	const [layoutView, setLayoutView] = useState(query.view);
	const [seenView, setSeenView] = useState(query.view);
	if (query.view !== seenView) {
		setSeenView(query.view);
		setLayoutView(query.view);
	}
	const mapVisible = layoutView !== "daftar";

	useEffect(() => {
		if (highlight.kind !== "active" || highlight.source !== "pin") {
			return;
		}
		rowRefs.current
			.get(highlight.slug)
			?.scrollIntoView({ block: "nearest", behavior: "instant" });
	}, [highlight]);

	function onCommitArea(bounds: MapBounds) {
		onQueryChange(commitMapArea(query, bounds));
	}

	function commitView(view: CariView) {
		const next = withCariView(query, view);
		if (prefersReducedMotion()) {
			setLayoutView(view);
			onQueryChange(next);
			return;
		}
		startTransition(() => {
			addTransitionType(cariViewType);
			setLayoutView(view);
			onQueryChange(next);
		});
	}

	return (
		<main
			className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden outline-none"
			id="main"
			tabIndex={-1}
		>
			<div className="z-30 shrink-0 border-b bg-background/95 backdrop-blur-sm">
				<div className="page-shell flex flex-col gap-2 py-2">
					<div className="flex min-w-0 items-center gap-3">
						<FilterBar query={query} />
						<ViewToggle
							className="hidden shrink-0 lg:inline-flex"
							onView={commitView}
							view={layoutView}
						/>
					</div>
					<FilterChips chips={result.chips} view={query.view} />
				</div>
			</div>

			<div className="flex h-full min-h-0 flex-1 overflow-hidden">
				<ListingPane
					inert={layoutView === "peta"}
					items={placed}
					onHighlightEvent={dispatchHighlight}
					onQueryChange={onQueryChange}
					query={query}
					registerRow={(slug, node) => {
						if (node) {
							rowRefs.current.set(slug, node);
						} else {
							rowRefs.current.delete(slug);
						}
					}}
					total={result.total}
					view={layoutView}
				/>

				<ViewTransition default="none" name="cari-map" update={cariViewLayout}>
					<div
						className={cn(
							"relative h-full min-h-0 min-w-0 overflow-hidden",
							layoutView === "daftar" && "w-0 flex-none",
							layoutView === "split" && "hidden lg:block lg:min-w-0 lg:flex-1",
							layoutView === "peta" && "flex-1",
						)}
						inert={layoutView === "daftar" ? true : undefined}
					>
						<MapIsland
							fit={fit}
							highlight={highlight}
							items={placed}
							onCommitArea={onCommitArea}
							onHighlightEvent={dispatchHighlight}
							total={result.total}
							visible={mapVisible}
						/>
						{layoutView === "peta" && selected ? (
							<div className="absolute inset-x-4 bottom-24 z-10 max-h-[40%] overflow-y-auto lg:bottom-[max(1rem,env(safe-area-inset-bottom))] lg:max-w-sm">
								<ListingCard
									listing={selected.listing}
									onHighlightEvent={(kind, input) => {
										if (kind === "select") {
											dispatchHighlight({
												type: "select",
												slug: selected.listing.slug,
												source: "list",
												input,
											});
										}
									}}
									variant="split"
								/>
							</div>
						) : null}
					</div>
				</ViewTransition>
			</div>

			<div className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex justify-center lg:hidden">
				<ViewToggle
					className="pointer-events-auto shadow-md"
					onView={commitView}
					options={MOBILE_VIEW_OPTIONS}
					view={layoutView === "peta" ? "peta" : "daftar"}
				/>
			</div>
		</main>
	);
}

function ListingPane({
	inert,
	items,
	query,
	onHighlightEvent,
	onQueryChange,
	registerRow,
	total,
	view,
}: {
	inert?: boolean;
	items: readonly PlacedListing[];
	query: SearchQuery;
	onHighlightEvent: (event: HighlightEvent) => void;
	onQueryChange: (next: SearchQuery) => void;
	registerRow: (slug: string, node: HTMLElement | null) => void;
	total: number;
	view: CariView;
}) {
	const split = realizeCariLayout(view, "wide") === "split";
	return (
		<ViewTransition default="none" name="cari-list" update={cariViewLayout}>
			<div
				className={cn(
					"flex h-full min-h-0 min-w-0 flex-col overflow-hidden",
					view === "peta" ? "w-0 flex-none" : "flex-1",
					view !== "peta" &&
						(split ? "page-shell cari-split-pane" : "page-shell"),
				)}
				inert={inert}
			>
				<div className="shrink-0 bg-background py-2">
					<h1 className="font-heading font-semibold text-xl tracking-tight">
						{searchHeading(query)}
					</h1>
					<div className="mt-2 flex h-8 items-center justify-between gap-2">
						<p
							aria-live="polite"
							className="min-w-0 truncate text-muted-foreground text-sm tabular-nums"
						>
							{total.toLocaleString("id-ID")} kos tersedia
						</p>
						<Select
							onValueChange={(value) => {
								const sort = SORT_KEYS.find((item) => item === value);
								if (sort) {
									onQueryChange({ ...query, sort });
								}
							}}
							value={query.sort}
						>
							<SelectTrigger
								aria-label="Urutkan"
								className="h-7 w-auto min-w-0 border-0 bg-transparent px-0 shadow-none before:hidden dark:bg-transparent"
								size="sm"
							>
								<SelectValue>
									<span className="text-muted-foreground">Urutkan: </span>
									{sortLabels[query.sort]}
								</SelectValue>
							</SelectTrigger>
							<SelectContent align="end" alignItemWithTrigger={false}>
								{SORT_KEYS.map((sort) => (
									<SelectItem key={sort} value={sort}>
										{sortLabels[sort]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<ScrollArea
					className="h-full min-h-0 flex-1"
					maskClassName={listFadeMaskClassName}
					maskHeight={48}
					viewportClassName="overscroll-contain"
				>
					{items.length === 0 ? (
						<div className={cn("py-4", view !== "peta" && "pb-20 lg:pb-4")}>
							<Empty className="border border-dashed">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<HugeiconsIcon aria-hidden="true" icon={Search01Icon} />
									</EmptyMedia>
									<EmptyTitle>Kos tidak ditemukan</EmptyTitle>
									<EmptyDescription>
										{query.bounds
											? "Ubah filter atau cari di lokasi lain, atau geser peta."
											: "Ubah filter atau cari di lokasi lain."}
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
						</div>
					) : (
						<div
							className={cn(
								"grid items-stretch gap-5 py-4",
								view !== "peta" && "pb-20 lg:pb-4",
								split
									? "grid-cols-1 sm:grid-cols-2"
									: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
							)}
						>
							{items.map((placed) => (
								<article
									className="h-full min-w-0"
									key={placed.listing.slug}
									ref={(node) => registerRow(placed.listing.slug, node)}
								>
									<ListingCard
										listing={placed.listing}
										onHighlightEvent={(kind, input) => {
											if (kind === "enter") {
												onHighlightEvent({
													type: "enter",
													slug: placed.listing.slug,
													source: "list",
													input,
												});
												return;
											}
											if (kind === "leave") {
												onHighlightEvent({
													type: "leave",
													slug: placed.listing.slug,
													source: "list",
												});
												return;
											}
											onHighlightEvent({
												type: "select",
												slug: placed.listing.slug,
												source: "list",
												input,
											});
										}}
										variant="default"
									/>
								</article>
							))}
						</div>
					)}
				</ScrollArea>
			</div>
		</ViewTransition>
	);
}

function ViewToggle({
	view,
	onView,
	className,
	options = VIEW_OPTIONS,
}: {
	view: CariView;
	onView: (view: CariView) => void;
	className?: string;
	options?: readonly { view: CariView; label: string }[];
}) {
	return (
		<Tabs
			className="contents"
			onValueChange={(next) => {
				const selected = options.find((option) => option.view === next);
				if (selected) {
					onView(selected.view);
				}
			}}
			value={view}
		>
			<TabsList aria-label="Tampilan" className={className} size="sm">
				{options.map((option) => (
					<TabsTab
						className="min-h-8 px-3 text-xs"
						key={option.view}
						value={option.view}
					>
						{option.label}
					</TabsTab>
				))}
			</TabsList>
		</Tabs>
	);
}
