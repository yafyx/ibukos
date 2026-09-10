"use client";

import { Link } from "@tanstack/react-router";

import { KosImage } from "@/components/media/kos-image";
import { buildCariSearch } from "@/domain/facets/url";
import { promoSlides } from "@/domain/kos/catalog";
import { pressable } from "@/lib/motion";

export function PromoBanners() {
	const featured = promoSlides[0];
	const rest = promoSlides.slice(1);

	if (!featured) {
		return null;
	}

	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-heading text-lg font-semibold tracking-tight">Promo spesial</h2>
			<div className="grid gap-3 md:grid-cols-3">
				<PromoTile className="md:col-span-2" slide={featured} />
				<div className="grid gap-3">
					{rest.map((slide) => (
						<PromoTile key={slide.id} slide={slide} />
					))}
				</div>
			</div>
		</section>
	);
}

function PromoTile({
	className,
	slide,
}: {
	className?: string;
	slide: (typeof promoSlides)[number];
}) {
	return (
		<Link
			className={`relative block min-h-40 overflow-hidden ${pressable} ${className ?? ""}`}
			search={buildCariSearch(slide.query ?? {})}
			to="/cari"
		>
			<KosImage
				alt=""
				className="hover-fine-scale size-full min-h-40 object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
				height={400}
				src={slide.image}
				width={700}
			/>
			<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
			<div className="absolute inset-x-0 bottom-0 p-4 text-white">
				<p className="font-semibold text-pretty">{slide.title}</p>
				<p className="text-sm text-white/80 text-pretty">{slide.subtitle}</p>
			</div>
		</Link>
	);
}
