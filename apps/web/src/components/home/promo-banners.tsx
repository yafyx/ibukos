"use client";

import { Button } from "@ibukos/ui/components/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@ibukos/ui/components/carousel";
import { cn } from "@ibukos/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { SectionHeader } from "@/components/home/section-header";
import { KosImage } from "@/components/media/kos-image";
import { buildCariSearch } from "@/domain/facets/url";
import { promoSlides } from "@/domain/kos/catalog";
import type { PromoSlide } from "@/domain/kos/types";
import { prefersReducedMotion, pressable } from "@/lib/motion";

const slideOutline =
	"outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10";

/** Mamikos promo art is ~817×346 (wide banner), not the 540×720 cache suffix. */
const PROMO_WIDTH = 817;
const PROMO_HEIGHT = 346;

export function PromoBanners() {
	if (promoSlides.length === 0) {
		return null;
	}

	const reduced = prefersReducedMotion();

	return (
		<section
			aria-labelledby="promo-banners-heading"
			className="flex flex-col gap-3"
		>
			<SectionHeader
				action={
					<Button
						render={
							<Link
								search={buildCariSearch({ badges: ["promo"] })}
								to="/cari"
							/>
						}
						size="sm"
						variant="ghost"
					>
						Lihat semua promo
					</Button>
				}
				id="promo-banners-heading"
				title="Promo & event"
			/>

			<div>
				<Carousel
					className="w-full"
					opts={{
						align: "start",
						containScroll: "trimSnaps",
						dragFree: false,
						duration: reduced ? 0 : 20,
						loop: false,
					}}
				>
					<CarouselContent className="cursor-grab items-start gap-3 active:cursor-grabbing sm:gap-4">
						{promoSlides.map((slide, index) => (
							<CarouselItem
								className="basis-auto shrink-0 self-start"
								key={slide.id}
							>
								<PromoTile index={index} slide={slide} />
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</section>
	);
}

function PromoTile({ index, slide }: { index: number; slide: PromoSlide }) {
	const label = `${slide.title}. ${slide.subtitle}`;

	return (
		<Link
			aria-label={label}
			className={cn(
				"group relative block w-fit overflow-hidden rounded-2xl bg-muted shadow-sm",
				"focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
				pressable,
			)}
			search={buildCariSearch(slide.query ?? {})}
			to="/cari"
		>
			<KosImage
				alt={slide.title}
				className={cn(
					"block aspect-817/346 h-auto w-[min(84vw,21rem)] object-cover sm:w-[20rem] md:w-[21rem] lg:w-[22rem]",
					slideOutline,
				)}
				decoding={index === 0 ? "sync" : "async"}
				fetchPriority={index === 0 ? "high" : undefined}
				height={PROMO_HEIGHT}
				loading={index <= 1 ? "eager" : "lazy"}
				src={slide.image}
				width={PROMO_WIDTH}
			/>
		</Link>
	);
}
