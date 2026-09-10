"use client";

import { Button } from "@ibukos/ui/components/button";
import { Group, GroupSeparator } from "@ibukos/ui/components/group";
import { Link, useRouterState } from "@tanstack/react-router";

import { LocationSearch } from "@/components/search/location-search";

import UserMenu from "../user-menu";

export function SiteHeader() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const showChromeSearch = pathname !== "/";

	return (
		<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
			<div className="page-shell flex flex-wrap items-center gap-2 py-2.5 sm:gap-3">
				<Link
					className="shrink-0 font-heading font-semibold text-primary text-xl tracking-tight"
					to="/"
				>
					<span className="inline-flex items-center gap-2">
						<img
							alt=""
							aria-hidden="true"
							className="size-9 rounded-md object-cover"
							src="/brand/ibukos-ibu.png"
						/>
						<span>Ibukos</span>
					</span>
				</Link>
				{showChromeSearch ? (
					<LocationSearch className="min-w-48 flex-1" size="chrome" />
				) : null}
				<nav className="ms-auto">
					<Group aria-label="Akun">
						<Button
							className="hidden sm:inline-flex"
							render={<Link to="/login" />}
							size="sm"
							variant="outline"
						>
							Iklankan kos
						</Button>
						<GroupSeparator className="hidden sm:block" />
						<UserMenu />
					</Group>
				</nav>
			</div>
		</header>
	);
}
