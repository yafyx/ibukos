"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ibukos/ui/components/button";
import { Checkbox } from "@ibukos/ui/components/checkbox";
import { CheckboxGroup } from "@ibukos/ui/components/checkbox-group";
import { Field, FieldLabel } from "@ibukos/ui/components/field";
import {
	Popover,
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from "@ibukos/ui/components/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ibukos/ui/components/select";
import { Slider } from "@ibukos/ui/components/slider";
import { Toggle } from "@ibukos/ui/components/toggle";
import { cn } from "@ibukos/ui/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import {
	DURATIONS,
	FACILITIES,
	GENDERS,
	RULES,
} from "@/domain/facets/definitions";
import type { SearchQuery } from "@/domain/facets/types";
import { applyFacet, clearFacet } from "@/domain/facets/url";
import {
	durationLabels,
	facilityLabels,
	formatPriceFilterLabel,
	formatPriceIdr,
	genderLabels,
	ruleLabels,
} from "@/domain/kos/labels";
import type { FacilityId, RuleId } from "@/domain/kos/types";

const PRICE_MAX = 3_000_000;

const pillTriggerClass =
	"h-7 w-auto min-w-0 shrink-0 whitespace-nowrap [&[data-popup-open]_svg]:rotate-180";

const chevronClassName =
	"size-3.5 transition-transform duration-[160ms] ease-[var(--ease-out)] motion-reduce:transition-none";

function isFacilityId(value: string): value is FacilityId {
	return FACILITIES.some((facility) => facility === value);
}

function isRuleId(value: string): value is RuleId {
	return RULES.some((rule) => rule === value);
}

function sliderPair(values: number | readonly number[]): [number, number] {
	if (typeof values === "number") {
		return [0, values];
	}
	return [values[0] ?? 0, values[1] ?? PRICE_MAX];
}

export function FilterBar({ query }: { query: SearchQuery }) {
	const navigate = useNavigate();
	const [priceRange, setPriceRange] = useState<[number, number]>([
		query.priceMin ?? 0,
		query.priceMax ?? PRICE_MAX,
	]);
	const priceLabel = formatPriceFilterLabel(query.priceMin, query.priceMax);
	const facilitiesActive = query.facilities.length > 0;
	const rulesActive = query.rules.length > 0;

	useEffect(() => {
		setPriceRange([query.priceMin ?? 0, query.priceMax ?? PRICE_MAX]);
	}, [query.priceMin, query.priceMax]);

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
		navigateQuery(
			applyFacet(query, "price", {
				priceMin: min > 0 ? min : undefined,
				priceMax: max < PRICE_MAX ? max : undefined,
			}),
		);
	}

	return (
		<nav
			aria-label="Filter pencarian"
			className="-mx-[var(--page-inline-start)] min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:mx-0 [&::-webkit-scrollbar]:hidden"
		>
			<div className="flex w-max min-w-full items-center gap-2 ps-[var(--page-inline-start)] pe-8 lg:px-0">
				<Select
					onValueChange={(value) => {
						if (value === "all") {
							navigateQuery(clearFacet(query, "gender"));
							return;
						}
						const gender = GENDERS.find((item) => item === value);
						if (gender) {
							navigateQuery(applyFacet(query, "gender", gender));
						}
					}}
					value={query.gender ?? "all"}
				>
					<SelectTrigger
						aria-label={
							query.gender
								? `Tipe kos: ${genderLabels[query.gender]}`
								: "Tipe kos"
						}
						className={cn(pillTriggerClass, query.gender && "bg-muted")}
						size="sm"
					>
						<SelectValue>
							{query.gender ? genderLabels[query.gender] : "Tipe kos"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent alignItemWithTrigger={false}>
						<SelectItem value="all">Semua tipe</SelectItem>
						{GENDERS.map((gender) => (
							<SelectItem key={gender} value={gender}>
								{genderLabels[gender]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<FacetPopover
					active={Boolean(priceLabel)}
					label={priceLabel ?? "Harga"}
				>
					<PopoverTitle className="text-sm">Harga sewa</PopoverTitle>
					<p className="mt-1 mb-3 text-muted-foreground text-sm tabular-nums">
						{formatPriceIdr(priceRange[0])} – {formatPriceIdr(priceRange[1])}
					</p>
					<Slider
						aria-label="Rentang harga sewa"
						max={PRICE_MAX}
						min={0}
						name="price-range"
						onValueChange={(values) => setPriceRange(sliderPair(values))}
						onValueCommitted={(values) => commitPrice(sliderPair(values))}
						step={50_000}
						value={priceRange}
					/>
					{priceLabel ? (
						<Button
							className="mt-3"
							onClick={() => navigateQuery(clearFacet(query, "price"))}
							size="sm"
							type="button"
							variant="ghost"
						>
							Hapus rentang harga
						</Button>
					) : null}
				</FacetPopover>

				<Select
					onValueChange={(value) => {
						if (value === "all") {
							navigateQuery(clearFacet(query, "duration"));
							return;
						}
						const duration = DURATIONS.find((item) => item === value);
						if (duration) {
							navigateQuery(applyFacet(query, "duration", duration));
						}
					}}
					value={query.duration ?? "all"}
				>
					<SelectTrigger
						aria-label={
							query.duration
								? `Durasi sewa: ${durationLabels[query.duration]}`
								: "Durasi sewa"
						}
						className={cn(pillTriggerClass, query.duration && "bg-muted")}
						size="sm"
					>
						<SelectValue>
							{query.duration ? durationLabels[query.duration] : "Durasi"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent alignItemWithTrigger={false}>
						<SelectItem value="all">Semua durasi</SelectItem>
						{DURATIONS.map((duration) => (
							<SelectItem key={duration} value={duration}>
								{durationLabels[duration]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<FacetPopover
					active={facilitiesActive}
					label={
						facilitiesActive
							? `Fasilitas (${query.facilities.length})`
							: "Fasilitas"
					}
				>
					<PopoverTitle className="mb-3 text-sm">Fasilitas</PopoverTitle>
					<CheckboxGroup
						className="flex flex-col gap-1"
						onValueChange={(values) =>
							navigateQuery({
								...query,
								facilities: values.filter(isFacilityId),
							})
						}
						value={query.facilities}
					>
						{FACILITIES.map((facility) => (
							<CheckRow key={facility} label={facilityLabels[facility]}>
								<Checkbox name="fasilitas" value={facility} />
							</CheckRow>
						))}
					</CheckboxGroup>
				</FacetPopover>

				<FacetPopover
					active={rulesActive}
					label={rulesActive ? `Aturan (${query.rules.length})` : "Aturan"}
				>
					<PopoverTitle className="mb-3 text-sm">Aturan kos</PopoverTitle>
					<CheckboxGroup
						className="flex flex-col gap-1"
						onValueChange={(values) =>
							navigateQuery({
								...query,
								rules: values.filter(isRuleId),
							})
						}
						value={query.rules}
					>
						{RULES.map((rule) => (
							<CheckRow key={rule} label={ruleLabels[rule]}>
								<Checkbox name="aturan" value={rule} />
							</CheckRow>
						))}
					</CheckboxGroup>
				</FacetPopover>

				<Toggle
					className="h-7 min-h-7 shrink-0"
					onPressedChange={(pressed) =>
						navigateQuery(applyFacet(query, "available", pressed))
					}
					pressed={query.availableOnly}
					size="sm"
					variant="outline"
				>
					Ada kamar
				</Toggle>
			</div>
		</nav>
	);
}

function FacetPopover({
	active,
	label,
	children,
}: {
	active: boolean;
	label: string;
	children: ReactNode;
}) {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						aria-pressed={active}
						className={cn(pillTriggerClass, active && "bg-muted")}
						size="sm"
						variant="outline"
					/>
				}
			>
				{label}
				<HugeiconsIcon
					aria-hidden="true"
					className={chevronClassName}
					icon={ArrowDown01Icon}
				/>
			</PopoverTrigger>
			<PopoverPopup align="start" className="w-80">
				{children}
			</PopoverPopup>
		</Popover>
	);
}

function CheckRow({ label, children }: { label: string; children: ReactNode }) {
	return (
		<Field className="w-full">
			<FieldLabel className="flex w-full cursor-pointer items-center gap-2.5 font-normal">
				{children}
				{label}
			</FieldLabel>
		</Field>
	);
}
