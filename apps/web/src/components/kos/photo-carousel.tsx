"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@ibukos/ui/components/carousel";

import { KosImage } from "@/components/media/kos-image";

export function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
	const slides = photos.length > 0 ? photos : [""];

	return (
		<Carousel className="w-full">
			<CarouselContent>
				{slides.map((photo, index) => (
					<CarouselItem key={photo || `fallback-${index}`}>
						<div className="aspect-[16/10] overflow-hidden rounded-lg">
							<KosImage
								alt={`${alt} foto ${index + 1}`}
								className="size-full object-cover"
								height={500}
								src={photo}
								width={800}
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			{slides.length > 1 ? (
				<>
					<CarouselPrevious className="left-2" />
					<CarouselNext className="right-2" />
				</>
			) : null}
		</Carousel>
	);
}
