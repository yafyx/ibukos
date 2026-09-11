"use client";

import {
	ArrowRight01Icon,
	Home01Icon,
	Moon02Icon,
	Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ibukos/ui/components/button";
import { Label } from "@ibukos/ui/components/label";
import { Switch } from "@ibukos/ui/components/switch";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";
import type { SearchQuery } from "@/domain/facets/types";
import { buildCariSearch, createEmptyQuery } from "@/domain/facets/url";
import { popularCampuses, popularCities } from "@/domain/kos/catalog";
import { campusBySlug, parseCitySlug } from "@/domain/seo/locations";

const ngekosTips = [
	"Tanya listrik termasuk atau belum sebelum DP.",
	"Cek jarak jalan kaki ke kampus — bukan cuma Google Maps.",
	"Survei pagi dan malam. Suara tetangga beda banget.",
	"Foto di listing ≠ realita. Survei dulu, baru transfer.",
] as const;

const exploreLinks: { label: string; query: Partial<SearchQuery> }[] = [
	{ label: "Semua kos", query: createEmptyQuery() },
	{ label: "Lagi promo", query: { badges: ["promo"] } },
	{ label: "Dikelola Ibukos", query: { badges: ["dikelola"] } },
	{ label: "Kos andalan", query: { badges: ["andalan"] } },
];

export function SiteFooter() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [tipIndex, setTipIndex] = useState(0);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setTipIndex((current) => (current + 1) % ngekosTips.length);
		}, 8000);
		return () => window.clearInterval(interval);
	}, []);

	const isDark = mounted && theme === "dark";
	const cities = popularCities.slice(0, 6);
	const campuses = popularCampuses.slice(0, 5);

	return (
		<footer className="relative mt-auto overflow-x-clip border-t">
			<HallwayBackdrop />

			<div className="relative border-b bg-linear-to-b from-primary/[0.06] to-transparent">
				<div className="page-shell flex flex-col gap-8 py-10 sm:py-12">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="flex max-w-md flex-col gap-3">
							<Link
								className="inline-flex w-fit items-center gap-2 font-heading font-semibold text-lg tracking-tight transition-opacity duration-[160ms] ease-[var(--ease-out)] hover:opacity-80 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
								to="/"
							>
								<img
									alt=""
									aria-hidden="true"
									className="size-10 rounded-xl object-cover ring-1 ring-border/60"
									src="/brand/ibukos-ibu.png"
								/>
								<span>Ibukos</span>
							</Link>
							<p className="text-pretty text-muted-foreground text-sm leading-relaxed">
								Setiap kos punya pintunya sendiri. Ibukos bantu kamu cari kamar
								yang pas, survei, lalu sewa, tanpa harus ketemuan berulang.
							</p>
							<p
								aria-live="polite"
								className="text-muted-foreground/80 text-xs italic"
							>
								Tips ngekos #{tipIndex + 1}: {ngekosTips[tipIndex]}
							</p>
						</div>

						<div className="flex flex-wrap gap-2">
							{[
								{ value: "7+", label: "kota" },
								{ value: "500+", label: "listing" },
								{ value: "Gratis", label: "survei" },
							].map((stat) => (
								<div
									key={stat.label}
									className="rounded-xl border bg-background/80 px-4 py-2 backdrop-blur-sm"
								>
									<p className="font-heading font-semibold text-sm tabular-nums">
										{stat.value}
									</p>
									<p className="text-muted-foreground text-xs">{stat.label}</p>
								</div>
							))}
						</div>
					</div>

					<nav
						aria-label="Koridor kos, kota populer"
						className="flex gap-3 overflow-x-auto pt-1.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					>
						{cities.map((city, index) => {
							const slug = parseCitySlug(city.slug);
							if (!slug) {
								return (
									<Link
										key={city.slug}
										className={cn(
											"footer-door group shrink-0",
											"flex w-[5.5rem] flex-col items-center gap-2",
										)}
										search={buildCariSearch(city.query)}
										to="/cari"
									>
										<FooterDoorPlate index={index} label={city.label} />
									</Link>
								);
							}
							return (
								<Link
									key={city.slug}
									className={cn(
										"footer-door group shrink-0",
										"flex w-[5.5rem] flex-col items-center gap-2",
									)}
									params={{ city: slug }}
									to="/kota/$city"
								>
									<FooterDoorPlate index={index} label={city.label} />
								</Link>
							);
						})}
					</nav>
				</div>
			</div>

			<div className="relative bg-muted/30">
				<div className="page-shell grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
					<FooterColumn title="Jelajahi">
						{exploreLinks.map((item) => (
							<FooterLink
								key={item.label}
								search={buildCariSearch(item.query)}
								to="/cari"
							>
								{item.label}
							</FooterLink>
						))}
					</FooterColumn>

					<FooterColumn title="Sekitar kampus">
						{campuses.map((campus) => {
							const landing = campusBySlug(campus.slug);
							if (landing && landing.listings.length > 0) {
								return (
									<FooterLink
										key={campus.slug}
										params={{ slug: landing.slug }}
										to="/kampus/$slug"
									>
										Kos {campus.label}
									</FooterLink>
								);
							}
							return (
								<FooterLink
									key={campus.slug}
									search={buildCariSearch(campus.query)}
									to="/cari"
								>
									Kos {campus.label}
								</FooterLink>
							);
						})}
					</FooterColumn>

					<FooterColumn title="Pemilik kos">
						<FooterLink to="/login">Daftarkan kos</FooterLink>
						<FooterLink to="/login">Kelola listing</FooterLink>
						<p className="mt-1 text-muted-foreground text-xs leading-relaxed">
							Listing terverifikasi dan promo biar kamar lebih cepat terisi.
						</p>
					</FooterColumn>

					<div className="flex flex-col gap-4">
						<p className="font-heading font-semibold text-sm">Mulai cari</p>
						<Button
							className="w-full sm:w-auto"
							render={<Link search={createEmptyQuery()} to="/cari" />}
						>
							<HugeiconsIcon aria-hidden="true" icon={Home01Icon} />
							Cari kos sekarang
						</Button>
						<Button
							className="w-full sm:w-auto"
							render={<Link to="/login" />}
							variant="outline"
						>
							Iklankan kos
							<HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} />
						</Button>
					</div>
				</div>
			</div>

			<div className="border-t bg-muted/50">
				<div className="page-shell flex flex-col gap-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between">
					<p className="text-muted-foreground text-xs">
						© {new Date().getFullYear()} Ibukos. Dibangun buat anak kos &
						pemilik kos di Indonesia.
					</p>

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
							onCheckedChange={(checked) =>
								setTheme(checked ? "dark" : "light")
							}
						/>
						<HugeiconsIcon
							aria-hidden="true"
							className="size-4 text-muted-foreground"
							icon={Moon02Icon}
						/>
						<Label
							className="text-muted-foreground text-sm"
							htmlFor="theme-mode"
						>
							{isDark ? "Gelap" : "Terang"}
						</Label>
					</div>
				</div>
			</div>
		</footer>
	);
}

function FooterDoorPlate({ index, label }: { index: number; label: string }) {
	return (
		<>
			<span className="footer-door-plate relative flex size-[4.5rem] flex-col items-center justify-center rounded-lg border-2 border-primary/20 bg-background/90 font-heading font-semibold text-primary shadow-sm backdrop-blur-sm">
				<span className="font-normal text-[0.65rem] text-muted-foreground uppercase tracking-widest">
					Kamar
				</span>
				<span className="text-xl tabular-nums leading-none">
					{String(index + 1).padStart(2, "0")}
				</span>
			</span>
			<span className="max-w-[5.5rem] truncate text-center text-muted-foreground text-xs transition-colors duration-[160ms] ease-[var(--ease-out)] group-hover:text-foreground">
				{label}
			</span>
		</>
	);
}

function FooterColumn({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<nav aria-label={title} className="flex flex-col gap-2">
			<p className="font-heading font-semibold text-sm">{title}</p>
			<div className="flex flex-col gap-1.5">{children}</div>
		</nav>
	);
}

function FooterLink({
	to,
	search,
	params,
	children,
}: {
	to: string;
	search?: ReturnType<typeof buildCariSearch>;
	params?: Record<string, string>;
	children: React.ReactNode;
}) {
	return (
		<Link
			className="w-fit text-muted-foreground text-sm transition-[color,transform] duration-[160ms] ease-[var(--ease-out)] hover:text-foreground active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
			params={params}
			search={search}
			to={to}
		>
			{children}
		</Link>
	);
}

function HallwayBackdrop() {
	return (
		<svg
			aria-hidden="true"
			className="pointer-events-none absolute inset-x-0 top-0 h-48 text-primary/[0.07] dark:text-primary/[0.05]"
			fill="none"
			preserveAspectRatio="xMidYMin slice"
			viewBox="0 0 1440 192"
		>
			<path
				d="M0 192 V72 h120 v120 M120 192 V48 h80 v24 h80 v120 M280 192 V96 h100 v96 M380 192 V32 h60 v40 h60 v120 M500 192 V80 h90 v112 M590 192 V56 h70 v40 h70 v96 M730 192 V88 h110 v104 M840 192 V40 h55 v52 h55 v100 M950 192 V72 h85 v120 M1035 192 V48 h75 v32 h75 v112 M1185 192 V96 h95 v96 M1280 192 V64 h80 v48 h80 v80"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.25"
			/>
			<path d="M0 192 H1440" stroke="currentColor" strokeWidth="2" />
		</svg>
	);
}
