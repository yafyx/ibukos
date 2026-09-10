"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Label } from "@ibukos/ui/components/label";
import { Switch } from "@ibukos/ui/components/switch";
import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { createEmptyQuery } from "@/domain/facets/url";

export function SiteFooter() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted && theme === "dark";

	return (
		<footer className="mt-auto border-t bg-muted/30">
			<div className="page-shell flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex flex-col gap-3">
					<p className="font-heading font-semibold text-sm">Ibukos</p>
					<nav className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
						<Link search={createEmptyQuery()} to="/cari">
							Cari kos
						</Link>
						<Link to="/login">Masuk</Link>
					</nav>
					<p className="text-muted-foreground text-xs">
						© {new Date().getFullYear()} Ibukos. Semua hak dilindungi.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<HugeiconsIcon
						aria-hidden="true"
						className="size-4 text-muted-foreground"
						icon={Sun03Icon}
					/>
					<Switch
						aria-label="Mode gelap"
						checked={isDark}
						id="theme-mode"
						onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
					/>
					<HugeiconsIcon
						aria-hidden="true"
						className="size-4 text-muted-foreground"
						icon={Moon02Icon}
					/>
					<Label className="text-muted-foreground text-sm" htmlFor="theme-mode">
						{isDark ? "Gelap" : "Terang"}
					</Label>
				</div>
			</div>
		</footer>
	);
}
