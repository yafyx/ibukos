"use client";

import {
	ArrowLeft01Icon,
	Gps01Icon,
	Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from "@ibukos/ui/components/accordion";
import { Button } from "@ibukos/ui/components/button";
import {
	Command,
	CommandDialog,
	CommandDialogClose,
	CommandDialogDescription,
	CommandDialogPopup,
	CommandDialogTitle,
	CommandDialogTrigger,
	CommandEmpty,
	CommandGroup,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	CommandList,
	CommandPanel,
	CommandSeparator,
	commandPopoverMask,
} from "@ibukos/ui/components/command";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ibukos/ui/components/tabs";
import { cn } from "@ibukos/ui/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { SearchQuery } from "@/domain/facets/types";
import { buildCariSearch, createEmptyQuery } from "@/domain/facets/url";
import {
	allLocationPlaces,
	type LocationKind,
	type LocationPlace,
	locationCities,
	locationKindLabel,
	nearestCitySlug,
	placeSearchValue,
	popularCampuses,
	queryForPlace,
} from "@/domain/kos/location-directory";
import { pressable } from "@/lib/motion";

const kindTabs: { value: LocationKind; label: string }[] = [
	{ value: "campus", label: "Kampus" },
	{ value: "area", label: "Area" },
	{ value: "station", label: "Stasiun & Halte" },
];

const commandRowClass = cn(
	"flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-left text-base outline-none transition-colors sm:min-h-7 sm:text-sm",
	"focus-visible:ring-2 focus-visible:ring-ring",
	"[@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent",
);

function placeToItem(place: LocationPlace) {
	return {
		...place,
		value: place.id,
	};
}

export function LocationSearch({
	className,
	size,
}: {
	className?: string;
	size: "hero" | "chrome";
}) {
	const navigate = useNavigate();
	const current = useSearch({ strict: false }) as { q?: string };
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [kind, setKind] = useState<LocationKind>("campus");
	const [locating, setLocating] = useState(false);
	const openedByKey = useRef(false);
	const hero = size === "hero";
	const searching = query.trim().length > 0;
	const items = useMemo(() => allLocationPlaces.map(placeToItem), []);

	useEffect(() => {
		if (open) {
			setQuery(current.q ?? "");
		}
	}, [current.q, open]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				event.key.toLowerCase() !== "k" ||
				!(event.metaKey || event.ctrlKey)
			) {
				return;
			}
			event.preventDefault();
			openedByKey.current = true;
			setOpen((isOpen) => !isOpen);
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	function go(search: SearchQuery) {
		setOpen(false);
		navigate({ search, to: "/cari" });
	}

	function goToPlace(place: LocationPlace) {
		go(queryForPlace(place));
	}

	function goToTypedQuery() {
		const q = query.trim();
		go(q ? { ...createEmptyQuery(), q } : createEmptyQuery());
	}

	function searchNearby() {
		if (!navigator.geolocation) {
			toast.error("Lokasi tidak tersedia di perangkat ini.");
			return;
		}
		setLocating(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocating(false);
				go(
					buildCariSearch({
						city: nearestCitySlug(
							position.coords.latitude,
							position.coords.longitude,
						),
					}),
				);
			},
			() => {
				setLocating(false);
				toast.error(
					"Gagal membaca lokasi. Izinkan akses lokasi, lalu coba lagi.",
				);
			},
			{ enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
		);
	}

	const placeholder = "Coba Tebet Jakarta Selatan";
	const triggerLabel =
		current.q?.trim() ||
		(hero ? placeholder : "Cari lokasi, area, atau kampus");

	return (
		<CommandDialog
			onOpenChange={(next) => {
				if (!next) {
					openedByKey.current = false;
				}
				setOpen(next);
			}}
			open={open}
		>
			<CommandDialogTrigger
				className={cn(
					"flex w-full items-center gap-2 rounded-lg border border-input bg-background text-start shadow-xs outline-none",
					"transition-[transform,box-shadow,border-color] duration-[160ms] ease-[var(--ease-out)]",
					"focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
					pressable,
					hero ? "h-12 max-w-xl px-4" : "h-8 px-3",
					className,
				)}
				onClick={() => {
					openedByKey.current = false;
				}}
				render={<button type="button" />}
			>
				<HugeiconsIcon
					aria-hidden="true"
					className="size-4 shrink-0 text-muted-foreground"
					icon={Search01Icon}
				/>
				<span
					className={cn(
						"min-w-0 flex-1 truncate text-sm",
						current.q ? "text-foreground" : "text-muted-foreground",
					)}
				>
					{triggerLabel}
				</span>
			</CommandDialogTrigger>

			<CommandDialogPopup
				className={cn(
					"max-sm:translate-none max-sm:fixed max-sm:inset-x-0 max-sm:top-0 max-sm:row-start-1 max-sm:h-dvh max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0 max-sm:before:hidden",
					"sm:max-h-[min(46rem,88dvh)] sm:max-w-2xl",
					openedByKey.current &&
						"duration-0 data-ending-style:scale-100 data-starting-style:scale-100",
				)}
			>
				<CommandDialogTitle className="sr-only">
					Cari lokasi kos
				</CommandDialogTitle>
				<CommandDialogDescription className="sr-only">
					Cari kampus, area, atau stasiun, lalu pilih untuk melihat kos di
					sekitarnya.
				</CommandDialogDescription>

				<Command
					itemToStringValue={(item: unknown) =>
						placeSearchValue(item as LocationPlace)
					}
					items={items}
					onValueChange={setQuery}
					value={query}
				>
					<div className="relative z-10 flex items-center gap-0.5 px-2 py-1.5 sm:gap-1 sm:px-2.5">
						<CommandDialogClose
							render={
								<Button
									aria-label="Tutup pencarian"
									className="shrink-0"
									size="icon-sm"
									variant="ghost"
								/>
							}
						>
							<HugeiconsIcon aria-hidden="true" icon={ArrowLeft01Icon} />
						</CommandDialogClose>
						<CommandInput
							aria-label="Cari lokasi, area, atau kampus"
							onKeyDown={(event) => {
								if (
									event.key === "Enter" &&
									query.trim() &&
									!event.nativeEvent.isComposing
								) {
									event.preventDefault();
									goToTypedQuery();
								}
							}}
							placeholder={placeholder}
							wrapperClassName="min-w-0 flex-1 px-0 py-0"
						/>
					</div>

					<CommandPanel className="flex min-h-0 flex-1 flex-col">
						{searching ? (
							<>
								<CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
								<CommandList maskClassName={commandPopoverMask}>
									{(item: LocationPlace) => (
										<CommandItem
											key={item.id}
											onClick={() => goToPlace(item)}
											value={item.id}
										>
											<span className="min-w-0 flex-1 truncate">
												{item.label}
											</span>
											<span className="text-muted-foreground text-xs">
												{locationKindLabel[item.kind]} · {item.cityLabel}
											</span>
										</CommandItem>
									)}
								</CommandList>
							</>
						) : (
							<BrowsePanel
								kind={kind}
								locating={locating}
								onKindChange={setKind}
								onNearby={searchNearby}
								onSelectPlace={goToPlace}
							/>
						)}
					</CommandPanel>
				</Command>
			</CommandDialogPopup>
		</CommandDialog>
	);
}

function BrowsePanel({
	kind,
	locating,
	onKindChange,
	onNearby,
	onSelectPlace,
}: {
	kind: LocationKind;
	locating: boolean;
	onKindChange: (kind: LocationKind) => void;
	onNearby: () => void;
	onSelectPlace: (place: LocationPlace) => void;
}) {
	return (
		<CommandList
			className="min-h-0 flex-1"
			maskClassName={commandPopoverMask}
			maskHeight={32}
		>
			<CommandGroup>
				<button
					className={cn(commandRowClass, pressable, locating && "opacity-64")}
					disabled={locating}
					onClick={onNearby}
					type="button"
				>
					<span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-background/80 shadow-xs">
						<HugeiconsIcon
							aria-hidden="true"
							className="size-3.5 text-muted-foreground"
							icon={Gps01Icon}
						/>
					</span>
					<span className="min-w-0 flex-1 truncate">
						{locating ? "Mencari lokasi kamu…" : "Cari di lokasi sekitar saya"}
					</span>
				</button>
			</CommandGroup>

			<CommandSeparator />

			<Tabs
				className="gap-3"
				onValueChange={(value) => onKindChange(value as LocationKind)}
				value={kind}
			>
				<TabsList className="w-full">
					{kindTabs.map((tab) => (
						<TabsTab className="flex-1 px-2" key={tab.value} value={tab.value}>
							{tab.label}
						</TabsTab>
					))}
				</TabsList>

				{kindTabs.map((tab) => (
					<TabsPanel
						className="flex flex-col gap-2"
						key={tab.value}
						value={tab.value}
					>
						{tab.value === "campus" ? (
							<CommandGroup>
								<CommandGroupLabel>Pencarian Populer</CommandGroupLabel>
								<div className="flex flex-wrap gap-1.5 px-2 pb-0.5">
									{popularCampuses.map((place) => (
										<Button
											className="h-7 rounded-full px-2.5 text-xs"
											key={place.id}
											onClick={() => onSelectPlace(place)}
											size="sm"
											variant="outline"
										>
											{place.label}
										</Button>
									))}
								</div>
							</CommandGroup>
						) : null}

						<CommandGroup>
							<CommandGroupLabel>
								{tab.value === "campus"
									? "Kampus berdasarkan kota"
									: tab.value === "area"
										? "Area berdasarkan kota"
										: "Stasiun & halte berdasarkan kota"}
							</CommandGroupLabel>
							<Accordion className="w-full">
								{locationCities.map((city) => {
									const places =
										tab.value === "campus"
											? city.campuses
											: tab.value === "area"
												? city.areas
												: city.stations;
									if (places.length === 0) {
										return null;
									}
									return (
										<AccordionItem
											className="border-border/60"
											key={`${tab.value}-${city.id}`}
											value={`${tab.value}-${city.id}`}
										>
											<AccordionTrigger className="px-2 py-2.5 font-medium text-sm">
												{city.label}
											</AccordionTrigger>
											<AccordionPanel className="pb-1">
												<ul className="flex flex-col gap-0.5">
													{places.map((place) => (
														<li key={place.id}>
															<button
																className={cn(commandRowClass, pressable)}
																onClick={() => onSelectPlace(place)}
																type="button"
															>
																{place.label}
															</button>
														</li>
													))}
												</ul>
											</AccordionPanel>
										</AccordionItem>
									);
								})}
							</Accordion>
						</CommandGroup>
					</TabsPanel>
				))}
			</Tabs>
		</CommandList>
	);
}
