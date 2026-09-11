"use client";

import { Button } from "@ibukos/ui/components/button";
import { Group, GroupSeparator } from "@ibukos/ui/components/group";
import { cn } from "@ibukos/ui/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
	LocationSearchSlot,
	useSearchDock,
} from "@/components/search/search-dock";

import UserMenu from "../user-menu";
import { HamburgerButton } from "./hamburger-button";
import { DesktopNav, MobileNavPanel } from "./site-nav";

export function SiteHeader() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const { heroVisible } = useSearchDock();
	const showChromeSearch = pathname !== "/" || !heroVisible;
	const headerRef = useRef<HTMLElement>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [menuMounted, setMenuMounted] = useState(false);
	const menuId = useId();

	const openMenu = useCallback(() => {
		setMenuMounted(true);
		setMenuOpen(true);
	}, []);

	const closeMenu = useCallback((instant = false) => {
		setMenuOpen(false);
		if (instant) {
			setMenuMounted(false);
		}
	}, []);

	useEffect(() => {
		const header = headerRef.current;
		if (!header) {
			return;
		}
		const sync = () => {
			document.documentElement.style.setProperty(
				"--site-header-height",
				`${header.getBoundingClientRect().height}px`,
			);
		};
		const observer = new ResizeObserver(sync);
		observer.observe(header);
		sync();
		return () => observer.disconnect();
	}, [showChromeSearch]);

	useEffect(() => {
		closeMenu(true);
	}, [pathname, closeMenu]);

	useEffect(() => {
		if (!menuMounted) {
			return;
		}

		const media = window.matchMedia("(min-width: 64rem)");
		const closeIfDesktop = () => {
			if (media.matches) {
				closeMenu(true);
			}
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeMenu(true);
			}
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeIfDesktop();
		media.addEventListener("change", closeIfDesktop);
		window.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			media.removeEventListener("change", closeIfDesktop);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [menuMounted, closeMenu]);

	return (
		<header
			className={cn(
				"sticky top-0 z-40 overflow-visible border-b pt-[env(safe-area-inset-top)]",
				menuMounted ? "bg-background" : "bg-background/95 backdrop-blur-sm",
			)}
			ref={headerRef}
			style={{ viewTransitionName: "site-header" }}
		>
			<div className="page-shell flex flex-wrap items-center gap-2 py-2 sm:gap-3 lg:h-14 lg:flex-nowrap lg:py-0">
				<Link
					className="inline-flex h-11 shrink-0 items-center gap-2.5 font-heading font-semibold text-primary text-xl tracking-tight lg:h-8 lg:gap-2"
					onClick={() => closeMenu(true)}
					to="/"
				>
					<img
						alt=""
						aria-hidden="true"
						className="size-9 shrink-0 rounded-lg object-cover lg:size-8"
						src="/brand/ibukos-ibu.png"
					/>
					<span className="leading-none">Ibukos</span>
				</Link>
				<DesktopNav />
				{showChromeSearch ? (
					<LocationSearchSlot
						className="order-last h-11 w-full min-w-0 basis-full lg:order-none lg:h-8 lg:min-w-48 lg:flex-1 lg:basis-auto"
						size="chrome"
					/>
				) : null}
				<div className="ms-auto flex items-center gap-3 lg:gap-2">
					<Group
						aria-label="Akun"
						className="hidden h-8 items-center sm:flex"
					>
						<Button
							className="h-8"
							nativeButton={false}
							render={<Link to="/login" />}
							variant="outline"
						>
							Iklankan kos
						</Button>
						<GroupSeparator className="self-stretch" />
						<UserMenu />
					</Group>
					<div className="sm:hidden">
						<UserMenu />
					</div>
					<HamburgerButton
						aria-controls={menuId}
						className="size-11 lg:size-8"
						onClick={() => {
							if (menuOpen) {
								closeMenu();
							} else {
								openMenu();
							}
						}}
						open={menuOpen}
					/>
				</div>
			</div>
			{menuMounted ? (
				<MobileNavPanel
					id={menuId}
					onExitComplete={() => setMenuMounted(false)}
					onNavigate={() => closeMenu(true)}
					open={menuOpen}
				/>
			) : null}
		</header>
	);
}
