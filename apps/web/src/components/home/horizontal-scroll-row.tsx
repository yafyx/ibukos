"use client";

import { ScrollArea } from "@ibukos/ui/components/scroll-area";
import { cn } from "@ibukos/ui/lib/utils";
import {
	forwardRef,
	type ReactNode,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";

const fadeMaskClassName =
	"z-20 before:from-background before:via-background/80 after:from-background after:via-background/80";

export type HorizontalScrollRowHandle = {
	scrollPrev: () => void;
	scrollNext: () => void;
};

export type HorizontalScrollState = {
	canScrollPrev: boolean;
	canScrollNext: boolean;
};

export const HorizontalScrollRow = forwardRef<
	HorizontalScrollRowHandle,
	{
		children: ReactNode;
		className?: string;
		edgeToEdge?: boolean;
		gapClassName?: string;
		maskClassName?: string;
		maskHeight?: number;
		onScrollStateChange?: (state: HorizontalScrollState) => void;
		snap?: boolean;
	}
>(function HorizontalScrollRow(
	{
		children,
		className,
		edgeToEdge = true,
		gapClassName = "gap-4",
		maskClassName = fadeMaskClassName,
		maskHeight = 48,
		onScrollStateChange,
		snap = true,
	},
	ref,
) {
	const viewportRef = useRef<HTMLDivElement>(null);
	const onScrollStateChangeRef = useRef(onScrollStateChange);
	onScrollStateChangeRef.current = onScrollStateChange;

	const scrollByPage = useCallback(
		(direction: -1 | 1) => {
			const viewport = viewportRef.current;
			if (!viewport) {
				return;
			}

			if (snap) {
				const track = viewport.querySelector<HTMLElement>(
					"[data-scroll-track]",
				);
				const items = track
					? Array.from(
							track.querySelectorAll<HTMLElement>("[data-scroll-item]"),
						)
					: [];
				if (items.length > 0) {
					const { scrollLeft } = viewport;
					const target =
						direction === 1
							? items.find((item) => item.offsetLeft > scrollLeft + 4)
							: [...items]
									.reverse()
									.find((item) => item.offsetLeft < scrollLeft - 4);

					if (target) {
						target.scrollIntoView({
							behavior: "smooth",
							block: "nearest",
							inline: "start",
						});
						return;
					}
				}
			}

			viewport.scrollBy({
				left: direction * viewport.clientWidth * 0.85,
				behavior: "smooth",
			});
		},
		[snap],
	);

	useImperativeHandle(
		ref,
		() => ({
			scrollPrev: () => scrollByPage(-1),
			scrollNext: () => scrollByPage(1),
		}),
		[scrollByPage],
	);

	const handleScrollStateChange = useCallback(
		(state: { left: boolean; right: boolean }) => {
			onScrollStateChangeRef.current?.({
				canScrollPrev: state.left,
				canScrollNext: state.right,
			});
		},
		[],
	);

	return (
		<div className={edgeToEdge ? "-mx-4" : undefined}>
			<ScrollArea
				className="w-full"
				dragScroll
				hideHorizontalScrollbar
				maskClassName={maskClassName}
				maskHeight={maskHeight}
				onScrollStateChange={handleScrollStateChange}
				viewportClassName={cn(
					"scroll-px-4",
					snap && "snap-x snap-mandatory",
				)}
				viewportRef={viewportRef}
			>
				<div
					className={cn("flex px-4 pb-2", gapClassName, className)}
					data-scroll-track=""
				>
					{children}
				</div>
			</ScrollArea>
		</div>
	);
});
