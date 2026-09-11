"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { ScrollArea } from "@ibukos/ui/components/scroll-area";
import { cn } from "@ibukos/ui/lib/utils";
import { ChevronsUpDownIcon, XIcon } from "lucide-react";
import type React from "react";

export const Autocomplete: typeof AutocompletePrimitive.Root =
	AutocompletePrimitive.Root;

export function AutocompleteInput({
	className,
	showTrigger = false,
	showClear = false,
	startAddon,
	size = "default",
	triggerProps,
	clearProps,
	...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
	showTrigger?: boolean;
	showClear?: boolean;
	startAddon?: React.ReactNode;
	size?: "sm" | "default" | "lg" | number;
	ref?: React.Ref<HTMLInputElement>;
	triggerProps?: AutocompletePrimitive.Trigger.Props;
	clearProps?: AutocompletePrimitive.Clear.Props;
}): React.ReactElement {
	const sizeValue = size ?? "default";

	return (
		<div
			className="relative w-full text-foreground has-disabled:opacity-64"
			data-slot="autocomplete-input-group"
		>
			{startAddon ? (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4"
					data-slot="autocomplete-start-addon"
				>
					{startAddon}
				</div>
			) : null}
			<AutocompletePrimitive.Input
				className={cn(
					"h-8.5 w-full min-w-0 bg-transparent px-[calc(--spacing(3)-1px)] text-base leading-8.5 outline-none placeholder:text-muted-foreground/72 sm:h-7.5 sm:text-sm sm:leading-7.5",
					sizeValue === "sm" &&
						"h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5",
					sizeValue === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5",
					startAddon && "ps-9 sm:ps-8",
					className,
				)}
				data-slot="autocomplete-input"
				{...props}
			/>
			{showTrigger ? (
				<AutocompleteTrigger
					className={cn(
						"absolute end-0.5 top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 items-center justify-center rounded-md opacity-80 sm:size-7",
					)}
					{...triggerProps}
				>
					<ChevronsUpDownIcon className="size-4" />
				</AutocompleteTrigger>
			) : null}
			{showClear ? (
				<AutocompleteClear className={clearProps?.className} {...clearProps} />
			) : null}
		</div>
	);
}

export function AutocompleteItem({
	className,
	children,
	...props
}: AutocompletePrimitive.Item.Props): React.ReactElement {
	return (
		<AutocompletePrimitive.Item
			className={cn(
				"flex min-h-8 cursor-default select-none items-center rounded-md px-2 py-1.5 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm",
				className,
			)}
			data-slot="autocomplete-item"
			{...props}
		>
			{children}
		</AutocompletePrimitive.Item>
	);
}

export function AutocompleteSeparator({
	className,
	...props
}: AutocompletePrimitive.Separator.Props): React.ReactElement {
	return (
		<AutocompletePrimitive.Separator
			className={cn("mx-2 my-1 h-px bg-border last:hidden", className)}
			data-slot="autocomplete-separator"
			{...props}
		/>
	);
}

export function AutocompleteGroup({
	className,
	...props
}: AutocompletePrimitive.Group.Props): React.ReactElement {
	return (
		<AutocompletePrimitive.Group
			className={cn("[[role=group]+&]:mt-1.5", className)}
			data-slot="autocomplete-group"
			{...props}
		/>
	);
}

export function AutocompleteGroupLabel({
	className,
	...props
}: AutocompletePrimitive.GroupLabel.Props): React.ReactElement {
	return (
		<AutocompletePrimitive.GroupLabel
			className={cn(
				"px-2 py-1.5 font-medium text-muted-foreground text-xs",
				className,
			)}
			data-slot="autocomplete-group-label"
			{...props}
		/>
	);
}

export function AutocompleteEmpty({
	className,
	...props
}: AutocompletePrimitive.Empty.Props): React.ReactElement {
	return (
		<AutocompletePrimitive.Empty
			className={cn(
				"not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm",
				className,
			)}
			data-slot="autocomplete-empty"
			{...props}
		/>
	);
}

export function AutocompleteList({
	className,
	maskClassName,
	maskHeight = 24,
	scrollAreaClassName,
	...props
}: AutocompletePrimitive.List.Props & {
	maskClassName?: string;
	maskHeight?: number;
	scrollAreaClassName?: string;
}): React.ReactElement {
	return (
		<ScrollArea
			className={cn("min-h-0 flex-1 rounded-[inherit]", scrollAreaClassName)}
			maskClassName={maskClassName}
			maskHeight={maskHeight}
		>
			<AutocompletePrimitive.List
				className={cn("not-empty:scroll-py-1 not-empty:p-1", className)}
				data-slot="autocomplete-list"
				{...props}
			/>
		</ScrollArea>
	);
}

export function AutocompleteClear({
	className,
	...props
}: AutocompletePrimitive.Clear.Props): React.ReactElement {
	return (
		<AutocompletePrimitive.Clear
			className={cn(
				"absolute end-0.5 top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md opacity-80 outline-none sm:size-7",
				className,
			)}
			data-slot="autocomplete-clear"
			{...props}
		>
			<XIcon className="size-4" />
		</AutocompletePrimitive.Clear>
	);
}

export function AutocompleteTrigger({
	className,
	children,
	...props
}: AutocompletePrimitive.Trigger.Props): React.ReactElement {
	return (
		<AutocompletePrimitive.Trigger
			className={className}
			data-slot="autocomplete-trigger"
			{...props}
		>
			{children}
		</AutocompletePrimitive.Trigger>
	);
}

export const AutocompleteCollection: typeof AutocompletePrimitive.Collection =
	AutocompletePrimitive.Collection;

export const useAutocompleteFilter: typeof AutocompletePrimitive.useFilter =
	AutocompletePrimitive.useFilter;

export { AutocompletePrimitive };
