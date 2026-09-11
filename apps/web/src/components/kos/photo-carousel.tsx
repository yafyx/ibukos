"use client";

import {
	ArrowLeft01Icon,
	ArrowRight01Icon,
	Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ibukos/ui/components/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	useCarousel,
} from "@ibukos/ui/components/carousel";
import { useDragScroll } from "@ibukos/ui/hooks/use-drag-scroll";
import { cn } from "@ibukos/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

import { KosImage } from "@/components/media/kos-image";
import { prefersReducedMotion } from "@/lib/motion";

const imageOutline =
	"outline outline-1 outline-black/10 -outline-offset-1 dark:outline-white/10";

export function PhotoCarousel({
	photos,
	alt,
}: {
	photos: string[];
	alt: string;
}) {
	const slides = photos.length > 0 ? photos : [""];
	const reduced = prefersReducedMotion();

	return (
		<Carousel
			className="flex flex-col gap-4"
			opts={{ align: "start", duration: reduced ? 0 : 16 }}
		>
			<div className="relative aspect-[2/1] overflow-hidden rounded-2xl sm:aspect-[16/9] [&_[data-slot=carousel-viewport]]:size-full">
				<CarouselContent className="h-full">
					{slides.map((photo, index) => (
						<CarouselItem className="h-full" key={photo || `fallback-${index}`}>
							<KosImage
								alt={`${alt} foto ${index + 1}`}
								className={cn("size-full object-cover", imageOutline)}
								fetchPriority={index === 0 ? "high" : undefined}
								height={560}
								loading={index === 0 ? "eager" : "lazy"}
								src={photo}
								width={960}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				{slides.length > 1 ? (
					<>
						<CarouselPrevious />
						<CarouselNext />
						<PhotoCount total={slides.length} />
						<LightboxTrigger alt={alt} slides={slides} />
					</>
				) : null}
			</div>
			{slides.length > 1 ? <PhotoThumbs slides={slides} /> : null}
		</Carousel>
	);
}

function PhotoCount({ total }: { total: number }) {
	const { selectedIndex } = useCarousel();

	return (
		<div className="pointer-events-none absolute end-4 bottom-4 z-10 rounded-full bg-black/55 px-2 py-0.5 font-medium text-white text-xs tabular-nums backdrop-blur-[2px]">
			{selectedIndex + 1}
			<span className="text-white/70"> / {total}</span>
		</div>
	);
}

function LightboxTrigger({ alt, slides }: { alt: string; slides: string[] }) {
	const { selectedIndex } = useCarousel();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<>
			<Button
				className="absolute start-4 bottom-4 z-10 h-8 rounded-full bg-black/55 px-3 text-white text-xs hover:bg-black/70 hover:text-white"
				onClick={() => setOpenIndex(selectedIndex)}
				type="button"
				variant="ghost"
			>
				Lihat semua ({slides.length})
			</Button>
			{openIndex !== null ? (
				<PhotoLightbox
					alt={alt}
					index={openIndex}
					onClose={() => setOpenIndex(null)}
					onIndexChange={setOpenIndex}
					slides={slides}
				/>
			) : null}
		</>
	);
}

function PhotoLightbox({
	alt,
	index,
	onClose,
	onIndexChange,
	slides,
}: {
	alt: string;
	index: number;
	onClose: () => void;
	onIndexChange: (index: number) => void;
	slides: string[];
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) {
			return;
		}
		if (!dialog.open) {
			dialog.showModal();
		}
		const onCancel = () => onClose();
		dialog.addEventListener("close", onCancel);
		return () => {
			dialog.removeEventListener("close", onCancel);
		};
	}, [onClose]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "ArrowRight") {
				event.preventDefault();
				onIndexChange((index + 1) % slides.length);
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				onIndexChange((index - 1 + slides.length) % slides.length);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index, onIndexChange, slides.length]);

	return (
		<dialog
			aria-label={`Foto ${alt}`}
			className="photo-lightbox m-auto w-[min(72rem,calc(100vw-1.5rem))] max-w-none border-0 bg-transparent p-0"
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					dialogRef.current?.close();
				}
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") {
					dialogRef.current?.close();
				}
			}}
			ref={dialogRef}
		>
			<div className="relative overflow-hidden rounded-2xl bg-black">
				<KosImage
					alt={`${alt} foto ${index + 1}`}
					className="max-h-[min(80vh,40rem)] w-full object-contain"
					height={720}
					src={slides[index]}
					width={1200}
				/>
				<p className="absolute end-4 bottom-4 rounded-full bg-black/55 px-2 py-0.5 font-medium text-white text-xs tabular-nums">
					{index + 1} / {slides.length}
				</p>
				<Button
					aria-label="Tutup"
					className="absolute end-4 top-4 size-8 rounded-full bg-black/55 text-white hover:bg-black/70 hover:text-white"
					onClick={() => dialogRef.current?.close()}
					size="icon-sm"
					variant="ghost"
				>
					<HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} />
				</Button>
				{slides.length > 1 ? (
					<>
						<Button
							aria-label="Foto sebelumnya"
							className="absolute start-4 top-1/2 size-9 -translate-y-1/2 rounded-full bg-black/55 text-white hover:bg-black/70 hover:text-white"
							onClick={() =>
								onIndexChange((index - 1 + slides.length) % slides.length)
							}
							size="icon"
							variant="ghost"
						>
							<HugeiconsIcon aria-hidden="true" icon={ArrowLeft01Icon} />
						</Button>
						<Button
							aria-label="Foto berikutnya"
							className="absolute end-4 top-1/2 size-9 -translate-y-1/2 rounded-full bg-black/55 text-white hover:bg-black/70 hover:text-white"
							onClick={() => onIndexChange((index + 1) % slides.length)}
							size="icon"
							variant="ghost"
						>
							<HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} />
						</Button>
					</>
				) : null}
			</div>
		</dialog>
	);
}

function PhotoThumbs({ slides }: { slides: string[] }) {
	const { scrollTo, selectedIndex } = useCarousel();
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [canScrollNext, setCanScrollNext] = useState(false);
	useDragScroll(scrollerRef);

	useEffect(() => {
		const element = scrollerRef.current;
		if (!element) {
			return;
		}

		const update = () => {
			setCanScrollNext(
				element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
			);
		};

		update();
		element.addEventListener("scroll", update, { passive: true });
		const observer = new ResizeObserver(update);
		observer.observe(element);
		return () => {
			element.removeEventListener("scroll", update);
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		const selected = scrollerRef.current?.querySelector(
			`[data-thumb="${selectedIndex}"]`,
		);
		selected?.scrollIntoView({
			block: "nearest",
			inline: "nearest",
			behavior: prefersReducedMotion() ? "auto" : "smooth",
		});
	}, [selectedIndex]);

	return (
		<div className="relative">
			<div
				className="flex cursor-grab gap-2 overflow-x-auto pe-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				ref={scrollerRef}
			>
				{slides.map((photo, index) => {
					const selected = index === selectedIndex;
					return (
						<button
							aria-current={selected}
							aria-label={`Foto ${index + 1} dari ${slides.length}`}
							className={cn(
								"photo-thumb relative h-20 w-40 shrink-0 overflow-hidden rounded-xl",
								"transition-[opacity,transform] duration-[160ms] ease-[var(--ease-out)]",
								"active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
								"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								selected ? "opacity-100" : "opacity-70",
							)}
							data-thumb={index}
							key={photo || `thumb-${index}`}
							onClick={() => scrollTo(index)}
							type="button"
						>
							<KosImage
								alt=""
								className={cn("size-full object-cover", imageOutline)}
								height={160}
								src={photo}
								width={240}
							/>
							{selected ? (
								<span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-foreground ring-inset" />
							) : null}
						</button>
					);
				})}
			</div>
			{canScrollNext ? (
				<Button
					aria-label="Foto berikutnya"
					className="absolute end-0 top-1/2 z-10 size-9 -translate-y-1/2 rounded-full bg-background shadow-md"
					onClick={() => {
						scrollerRef.current?.scrollBy({
							left: scrollerRef.current.clientWidth * 0.6,
							behavior: prefersReducedMotion() ? "auto" : "smooth",
						});
					}}
					size="icon"
					variant="outline"
				>
					<HugeiconsIcon
						aria-hidden="true"
						className="size-4"
						icon={ArrowRight01Icon}
					/>
				</Button>
			) : null}
		</div>
	);
}
