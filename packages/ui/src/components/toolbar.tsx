"use client";

import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { cn } from "@ibukos/ui/lib/utils";
import type React from "react";

export function Toolbar({
	className,
	...props
}: ToolbarPrimitive.Root.Props): React.ReactElement {
	return (
		<ToolbarPrimitive.Root
			className={cn(
				"relative flex flex-wrap items-center gap-2 rounded-lg border bg-card not-dark:bg-clip-padding p-1 text-card-foreground before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)]",
				className,
			)}
			data-slot="toolbar"
			{...props}
		/>
	);
}

export function ToolbarButton({
	className,
	...props
}: ToolbarPrimitive.Button.Props): React.ReactElement {
	return (
		<ToolbarPrimitive.Button
			className={cn(className)}
			data-slot="toolbar-button"
			{...props}
		/>
	);
}

export function ToolbarGroup({
	className,
	...props
}: ToolbarPrimitive.Group.Props): React.ReactElement {
	return (
		<ToolbarPrimitive.Group
			className={cn("flex flex-wrap items-center gap-1", className)}
			data-slot="toolbar-group"
			{...props}
		/>
	);
}

export function ToolbarSeparator({
	className,
	...props
}: ToolbarPrimitive.Separator.Props): React.ReactElement {
	return (
		<ToolbarPrimitive.Separator
			className={cn(
				"shrink-0 bg-border data-[orientation=horizontal]:my-0.5 data-[orientation=vertical]:my-1.5 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
				className,
			)}
			data-slot="toolbar-separator"
			{...props}
		/>
	);
}

export { ToolbarPrimitive };
