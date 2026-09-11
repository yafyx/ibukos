"use client";

import {
	MotionNavigationMenu,
	MotionNavigationMenuContent,
	MotionNavigationMenuItem,
	MotionNavigationMenuLink,
	MotionNavigationMenuList,
	MotionNavigationMenuTrigger,
} from "@ibukos/ui/components/motion-navigation-menu";
import { ScrollArea } from "@ibukos/ui/components/scroll-area";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { KosImage } from "@/components/media/kos-image";

import {
	desktopNavMenus,
	type SiteNavLink,
	type SiteNavSection,
	siteNavSections,
} from "./nav";

function campusArt(item: SiteNavLink): string | undefined {
	if ("image" in item) {
		return item.image;
	}
	return undefined;
}

function navSubtitle(item: SiteNavLink): string | undefined {
	if ("subtitle" in item) {
		return item.subtitle;
	}
	return undefined;
}

export function DesktopNav({ className }: { className?: string }) {
	return (
		<MotionNavigationMenu
			aria-label="Utama"
			className={cn("hidden h-8 items-center lg:flex", className)}
		>
			<MotionNavigationMenuList className="h-8">
				{desktopNavMenus.map((menu) => (
					<MotionNavigationMenuItem key={menu.id} value={menu.id}>
						<MotionNavigationMenuTrigger>
							{menu.label}
						</MotionNavigationMenuTrigger>
						<MotionNavigationMenuContent highlightClassName="rounded-md bg-accent">
							<MenuPanel menuId={menu.id} sections={menu.sections} />
						</MotionNavigationMenuContent>
					</MotionNavigationMenuItem>
				))}
			</MotionNavigationMenuList>
		</MotionNavigationMenu>
	);
}

function MenuPanel({
	menuId,
	sections,
}: {
	menuId: string;
	sections: SiteNavSection[];
}) {
	const items = sections.flatMap((section) => section.items);
	const campusMenu =
		menuId === "kampus" && items.every((item) => campusArt(item));

	if (campusMenu) {
		return (
			<div className="grid w-max grid-cols-4 gap-1">
				{items.map((item) => (
					<CampusNavLink item={item} key={item.label} />
				))}
			</div>
		);
	}

	return (
		<div className="flex w-max gap-4">
			{sections.map((section) => (
				<div className="min-w-36" key={section.id}>
					<p className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
						{section.label}
					</p>
					{section.items.map((item) => (
						<NavMenuLink item={item} key={item.label} />
					))}
				</div>
			))}
		</div>
	);
}

export function MobileNavPanel({
	id,
	open,
	onNavigate,
	onExitComplete,
}: {
	id: string;
	open: boolean;
	onNavigate: () => void;
	onExitComplete: () => void;
}) {
	return (
		<div
			className="site-mobile-nav fixed inset-x-0 top-[var(--site-header-height)] bottom-0 z-40 bg-background lg:hidden"
			data-open={open ? "true" : "false"}
			inert={!open}
			onTransitionEnd={(event) => {
				if (event.target !== event.currentTarget) {
					return;
				}
				if (event.propertyName !== "opacity") {
					return;
				}
				if (!open) {
					onExitComplete();
				}
			}}
		>
			<ScrollArea className="h-full" viewportClassName="overscroll-contain">
				<nav
					aria-hidden={!open}
					aria-label="Menu"
					className="site-mobile-nav-list page-shell flex flex-col gap-8 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
					id={id}
				>
					{siteNavSections.map((section) => (
						<MobileNavSection
							key={section.id}
							onNavigate={onNavigate}
							section={section}
						/>
					))}
				</nav>
			</ScrollArea>
		</div>
	);
}

function MobileNavSection({
	section,
	onNavigate,
}: {
	section: SiteNavSection;
	onNavigate: () => void;
}) {
	const campusSection =
		section.id === "kampus" && section.items.every((item) => campusArt(item));

	if (campusSection) {
		return (
			<div className="flex flex-col gap-3">
				<p className="text-muted-foreground text-sm">{section.label}</p>
				<div className="grid grid-cols-4 gap-2">
					{section.items.map((item) => (
						<MobileCampusLink
							item={item}
							key={item.label}
							onNavigate={onNavigate}
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			<p className="text-muted-foreground text-sm">{section.label}</p>
			{section.items.map((item) => (
				<SiteRouterLink
					className="rounded-md py-1.5 font-medium text-xl tracking-tight outline-none transition-[color,transform] duration-[160ms] ease-[var(--ease-out)] focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.97] active:text-primary motion-reduce:transition-none motion-reduce:active:scale-100"
					item={item}
					key={item.label}
					onClick={onNavigate}
				/>
			))}
		</div>
	);
}

function CampusMark({ src, size }: { src: string; size: "sm" | "md" }) {
	return (
		<span
			className={cn(
				"campus-tile__logo flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_oklch(0_0_0/0.06),0_4px_12px_-2px_oklch(0_0_0/0.08)] ring-1 ring-black/[0.04] dark:bg-white/95 dark:ring-white/10",
				size === "md" ? "size-16 p-2" : "size-14 p-1.5",
			)}
		>
			<KosImage
				alt=""
				aria-hidden="true"
				className="size-full object-contain"
				height={size === "md" ? 56 : 48}
				src={src}
				width={size === "md" ? 56 : 48}
			/>
		</span>
	);
}

function CampusCaption({ item }: { item: SiteNavLink }) {
	const subtitle = navSubtitle(item);
	return (
		<span className="flex min-w-0 flex-col gap-0.5">
			<span className="block font-heading font-semibold text-xs tracking-tight">
				{item.label}
			</span>
			{subtitle ? (
				<span className="block text-muted-foreground text-xs">{subtitle}</span>
			) : null}
		</span>
	);
}

function CampusNavLink({ item }: { item: SiteNavLink }) {
	const image = campusArt(item);
	if (!image) {
		return <NavMenuLink item={item} />;
	}

	return (
		<MotionNavigationMenuLink
			className="campus-tile flex min-w-20 flex-col items-center gap-2 px-2 py-2 text-center"
			render={<NavLink item={item} />}
		>
			<CampusMark size="sm" src={image} />
			<CampusCaption item={item} />
		</MotionNavigationMenuLink>
	);
}

function MobileCampusLink({
	item,
	onNavigate,
}: {
	item: SiteNavLink;
	onNavigate: () => void;
}) {
	const image = campusArt(item);
	if (!image) {
		return (
			<SiteRouterLink
				className="rounded-md py-1.5 font-medium text-xl tracking-tight"
				item={item}
				onClick={onNavigate}
			/>
		);
	}

	const subtitle = navSubtitle(item);
	return (
		<NavLink
			aria-label={
				subtitle
					? `Cari kos sekitar ${item.label}, ${subtitle}`
					: `Cari kos sekitar ${item.label}`
			}
			className="campus-tile flex flex-col items-center gap-2 rounded-xl px-1 py-2 text-center outline-none transition-transform duration-[160ms] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
			item={item}
			onClick={onNavigate}
		>
			<CampusMark size="md" src={image} />
			<CampusCaption item={item} />
		</NavLink>
	);
}

function NavMenuLink({ item }: { item: SiteNavLink }) {
	return (
		<MotionNavigationMenuLink render={<NavLink item={item} />}>
			{item.label}
		</MotionNavigationMenuLink>
	);
}

function SiteRouterLink({
	item,
	className,
	onClick,
}: {
	item: SiteNavLink;
	className?: string;
	onClick?: () => void;
}) {
	return (
		<NavLink className={className} item={item} onClick={onClick}>
			{item.label}
		</NavLink>
	);
}

function NavLink({
	item,
	className,
	onClick,
	children,
	"aria-label": ariaLabel,
}: {
	item: SiteNavLink;
	className?: string;
	onClick?: () => void;
	children?: ReactNode;
	"aria-label"?: string;
}) {
	if (item.to === "/cari") {
		return (
			<Link
				aria-label={ariaLabel}
				className={className}
				onClick={onClick}
				search={item.search}
				to="/cari"
			>
				{children}
			</Link>
		);
	}
	if (item.to === "/kota/$city") {
		return (
			<Link
				aria-label={ariaLabel}
				className={className}
				onClick={onClick}
				params={item.params}
				to="/kota/$city"
			>
				{children}
			</Link>
		);
	}
	if (item.to === "/kampus/$slug") {
		return (
			<Link
				aria-label={ariaLabel}
				className={className}
				onClick={onClick}
				params={item.params}
				to="/kampus/$slug"
			>
				{children}
			</Link>
		);
	}
	if (item.to === "/tipe/$gender") {
		return (
			<Link
				aria-label={ariaLabel}
				className={className}
				onClick={onClick}
				params={item.params}
				to="/tipe/$gender"
			>
				{children}
			</Link>
		);
	}
	return (
		<Link
			aria-label={ariaLabel}
			className={className}
			onClick={onClick}
			to={item.to}
		>
			{children}
		</Link>
	);
}
