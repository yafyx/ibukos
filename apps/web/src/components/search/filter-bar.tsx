"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Checkbox } from "@ibukos/ui/components/checkbox";
import { CheckboxGroup } from "@ibukos/ui/components/checkbox-group";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@ibukos/ui/components/collapsible";
import { Field, FieldLabel } from "@ibukos/ui/components/field";
import { Fieldset, FieldsetLegend } from "@ibukos/ui/components/fieldset";
import { Label } from "@ibukos/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ibukos/ui/components/select";
import { Slider } from "@ibukos/ui/components/slider";
import { Switch } from "@ibukos/ui/components/switch";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@ibukos/ui/components/toggle-group";
import {
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarSeparator,
} from "@ibukos/ui/components/toolbar";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
	DURATIONS,
	FACILITIES,
	GENDERS,
	SORT_KEYS,
} from "@/domain/facets/definitions";
import type { SearchQuery } from "@/domain/facets/types";
import { applyFacet, clearFacet } from "@/domain/facets/url";
import {
	durationLabels,
	facilityLabels,
	formatPriceIdr,
	genderLabels,
	sortLabels,
} from "@/domain/kos/labels";
import type { FacilityId } from "@/domain/kos/types";

const PRICE_MAX = 3_000_000;

export function FilterBar({ query }: { query: SearchQuery }) {
	const navigate = useNavigate();
	const [priceRange, setPriceRange] = useState<[number, number]>([
		query.priceMin ?? 0,
		query.priceMax ?? PRICE_MAX,
	]);

	function navigateQuery(next: SearchQuery) {
		navigate({ to: "/cari", search: next });
	}

	function commitPrice(values: number[]) {
		const min = values[0] ?? 0;
		const max = values[1] ?? PRICE_MAX;
		if (min <= 0 && max >= PRICE_MAX) {
			navigateQuery(clearFacet(query, "price"));
			return;
		}
		navigateQuery(applyFacet(query, "price", { priceMin: min, priceMax: max }));
	}

	return (
		<div className="flex flex-col gap-3">
			<Toolbar aria-label="Filter kos">
				<ToolbarGroup>
					<Fieldset className="flex flex-col gap-1">
						<FieldsetLegend className="px-1 font-medium text-xs">
							Tipe kos
						</FieldsetLegend>
						<ToggleGroup
							className="border-none p-0"
							onValueChange={(values) => {
								const gender = values[0] as
									| (typeof GENDERS)[number]
									| undefined;
								navigateQuery(applyFacet(query, "gender", gender));
							}}
							value={query.gender ? [query.gender] : []}
						>
							{GENDERS.map((gender) => (
								<ToolbarButton
									key={gender}
									render={<ToggleGroupItem value={gender} />}
								>
									{genderLabels[gender]}
								</ToolbarButton>
							))}
						</ToggleGroup>
					</Fieldset>
				</ToolbarGroup>
				<ToolbarSeparator />
				<ToolbarGroup>
					<Field className="min-w-[140px] gap-1">
						<FieldLabel className="px-1">Durasi</FieldLabel>
						<Select
							onValueChange={(value) => {
								if (value === "all") {
									navigateQuery(clearFacet(query, "duration"));
									return;
								}
								navigateQuery(applyFacet(query, "duration", value));
							}}
							value={query.duration ?? "all"}
						>
							<ToolbarButton render={<SelectTrigger className="w-full" />}>
								<SelectValue>
									{query.duration ? durationLabels[query.duration] : "Semua"}
								</SelectValue>
							</ToolbarButton>
							<SelectContent>
								<SelectItem value="all">Semua</SelectItem>
								{DURATIONS.map((duration) => (
									<SelectItem key={duration} value={duration}>
										{durationLabels[duration]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</ToolbarGroup>
				<ToolbarSeparator />
				<ToolbarGroup>
					<Field className="min-w-[160px] gap-1">
						<FieldLabel className="px-1">Urutkan</FieldLabel>
						<Select
							onValueChange={(value) =>
								navigateQuery(applyFacet(query, "sort", value))
							}
							value={query.sort}
						>
							<ToolbarButton render={<SelectTrigger className="w-full" />}>
								<SelectValue>{sortLabels[query.sort]}</SelectValue>
							</ToolbarButton>
							<SelectContent>
								{SORT_KEYS.map((sort) => (
									<SelectItem key={sort} value={sort}>
										{sortLabels[sort]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</ToolbarGroup>
				<ToolbarSeparator />
				<ToolbarGroup>
					<div className="flex items-center gap-2 px-2">
						<Switch
							aria-label="Hanya kos dengan kamar tersedia"
							checked={query.availableOnly}
							id="filter-available"
							onCheckedChange={(checked) =>
								navigateQuery(applyFacet(query, "available", checked))
							}
						/>
						<Label htmlFor="filter-available">Ada kamar</Label>
					</div>
				</ToolbarGroup>
			</Toolbar>

			<Fieldset className="flex max-w-md flex-col gap-3">
				<FieldsetLegend>
					Harga {formatPriceIdr(priceRange[0])} –{" "}
					{formatPriceIdr(priceRange[1])}
				</FieldsetLegend>
				<Slider
					aria-label="Rentang harga sewa"
					className="flex-1"
					max={PRICE_MAX}
					min={0}
					name="price-range"
					onValueChange={(values) => {
						const next = values as number[];
						setPriceRange([next[0] ?? 0, next[1] ?? PRICE_MAX]);
					}}
					onValueCommitted={(values) => commitPrice(values as number[])}
					step={50_000}
					value={priceRange}
				/>
			</Fieldset>

			<Collapsible>
				<CollapsibleTrigger className="inline-flex items-center gap-1 font-medium text-sm [&[data-open]_svg]:rotate-180">
					Fasilitas
					<HugeiconsIcon
						aria-hidden="true"
						className="size-3.5 text-muted-foreground transition-transform"
						icon={ArrowDown01Icon}
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<CheckboxGroup
						className="flex flex-row flex-wrap gap-3 pt-3"
						onValueChange={(values) =>
							navigateQuery({
								...query,
								facilities: (values as string[]).filter(
									(item): item is FacilityId =>
										FACILITIES.includes(item as FacilityId),
								),
							})
						}
						value={query.facilities}
					>
						{FACILITIES.map((facility) => (
							<Field className="flex-row items-center gap-2" key={facility}>
								<Checkbox name="fasilitas" value={facility} />
								<FieldLabel className="font-normal">
									{facilityLabels[facility]}
								</FieldLabel>
							</Field>
						))}
					</CheckboxGroup>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
