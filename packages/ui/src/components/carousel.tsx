"use client";

import { Button } from "@ibukos/ui/components/button";
import { cn } from "@ibukos/ui/lib/utils";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";

type CarouselApi = UseEmblaCarouselType[1];

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0];
	api: CarouselApi;
	scrollPrev: () => void;
	scrollNext: () => void;
	scrollTo: (index: number) => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	selectedIndex: number;
	snapCount: number;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
	const context = React.useContext(CarouselContext);
	if (!context) {
		throw new Error("useCarousel must be used within <Carousel>");
	}
	return context;
}

function Carousel({
	className,
	children,
	opts,
	...props
}: React.ComponentProps<"div"> & {
	opts?: Parameters<typeof useEmblaCarousel>[0];
}) {
	const [carouselRef, api] = useEmblaCarousel({ align: "start", ...opts });
	const [canScrollPrev, setCanScrollPrev] = React.useState(false);
	const [canScrollNext, setCanScrollNext] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [snapCount, setSnapCount] = React.useState(0);

	const onSelect = React.useCallback((embla: CarouselApi) => {
		if (!embla) {
			return;
		}
		setCanScrollPrev(embla.canScrollPrev());
		setCanScrollNext(embla.canScrollNext());
		setSelectedIndex(embla.selectedScrollSnap());
		setSnapCount(embla.scrollSnapList().length);
	}, []);

	const scrollPrev = React.useCallback(() => {
		api?.scrollPrev();
	}, [api]);

	const scrollNext = React.useCallback(() => {
		api?.scrollNext();
	}, [api]);

	const scrollTo = React.useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api],
	);

	React.useEffect(() => {
		if (!api) {
			return;
		}
		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onSelect]);

	return (
		<CarouselContext.Provider
			value={{
				api,
				canScrollNext,
				canScrollPrev,
				carouselRef,
				scrollNext,
				scrollPrev,
				scrollTo,
				selectedIndex,
				snapCount,
			}}
		>
			<div className={cn("relative", className)} data-slot="carousel" {...props}>
				{children}
			</div>
		</CarouselContext.Provider>
	);
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
	const { carouselRef } = useCarousel();
	return (
		<div className="overflow-hidden" data-slot="carousel-viewport" ref={carouselRef}>
			<div className={cn("flex", className)} data-slot="carousel-content" {...props} />
		</div>
	);
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
			data-slot="carousel-item"
			{...props}
		/>
	);
}

function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
	const { scrollPrev, canScrollPrev } = useCarousel();
	return (
		<Button
			aria-label="Slide sebelumnya"
			className={cn(className)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			size="icon"
			type="button"
			variant="outline"
			{...props}
		>
			<ChevronLeftIcon />
		</Button>
	);
}

function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
	const { scrollNext, canScrollNext } = useCarousel();
	return (
		<Button
			aria-label="Slide berikutnya"
			className={cn(className)}
			disabled={!canScrollNext}
			onClick={scrollNext}
			size="icon"
			type="button"
			variant="outline"
			{...props}
		>
			<ChevronRightIcon />
		</Button>
	);
}

function CarouselDots({ className }: { className?: string }) {
	const { scrollTo, selectedIndex, snapCount } = useCarousel();

	if (snapCount < 2) {
		return null;
	}

	return (
		<div
			className={cn("flex items-center justify-center gap-1", className)}
			data-slot="carousel-dots"
		>
			{Array.from({ length: snapCount }, (_, index) => (
				<button
					aria-current={index === selectedIndex}
					aria-label={`Foto ${index + 1} dari ${snapCount}`}
					className={cn(
						"relative size-1.5 rounded-full transition-[background-color,transform] duration-[160ms] ease-[var(--ease-out)] after:absolute after:-inset-2 after:content-['']",
						index === selectedIndex ? "scale-125 bg-white" : "bg-white/55",
					)}
					key={String(index)}
					onClick={() => scrollTo(index)}
					type="button"
				/>
			))}
		</div>
	);
}

export {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	useCarousel,
};
