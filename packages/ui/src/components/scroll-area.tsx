"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { useDragScroll } from "@ibukos/ui/hooks/use-drag-scroll";
import { useTouchPrimary } from "@ibukos/ui/hooks/use-has-primary-touch";
import { cn } from "@ibukos/ui/lib/utils";
import * as React from "react";

type Mask = {
	top: boolean;
	bottom: boolean;
	left: boolean;
	right: boolean;
};

type ScrollAreaContextProps = {
	isTouch: boolean;
	type: "auto" | "always" | "scroll" | "hover";
};

const ScrollAreaContext = React.createContext<ScrollAreaContextProps>({
	isTouch: false,
	type: "hover",
});

const hiddenMask: Mask = {
	top: false,
	bottom: false,
	left: false,
	right: false,
};

const scrollbarHiddenClass =
	"[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function assignViewportRef(
	ref: React.Ref<HTMLDivElement | null> | undefined,
	node: HTMLDivElement | null,
) {
	if (typeof ref === "function") {
		ref(node);
		return;
	}
	if (ref) {
		ref.current = node;
	}
}

function masksEqual(a: Mask, b: Mask) {
	return (
		a.top === b.top &&
		a.bottom === b.bottom &&
		a.left === b.left &&
		a.right === b.right
	);
}

function readOverflowMask(element: HTMLElement): Mask {
	const {
		scrollTop,
		scrollLeft,
		scrollWidth,
		clientWidth,
		scrollHeight,
		clientHeight,
	} = element;
	return {
		top: scrollTop > 0,
		bottom: scrollTop + clientHeight < scrollHeight - 1,
		left: scrollLeft > 0,
		right: scrollLeft + clientWidth < scrollWidth - 1,
	};
}

function ScrollArea({
	className,
	children,
	type = "hover",
	maskHeight = 30,
	maskClassName,
	viewportClassName,
	viewportRef: externalViewportRef,
	onScrollStateChange,
	dragScroll = false,
	hideHorizontalScrollbar = false,
	...props
}: ScrollAreaPrimitive.Root.Props & {
	type?: "auto" | "always" | "scroll" | "hover";
	viewportClassName?: string;
	viewportRef?: React.Ref<HTMLDivElement | null>;
	onScrollStateChange?: (state: Mask) => void;
	maskHeight?: number;
	maskClassName?: string;
	dragScroll?: boolean;
	hideHorizontalScrollbar?: boolean;
}) {
	const viewportRef = React.useRef<HTMLDivElement>(null);
	const [viewportNode, setViewportNode] = React.useState<HTMLDivElement | null>(
		null,
	);
	const setViewportRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			viewportRef.current = node;
			setViewportNode(node);
			assignViewportRef(externalViewportRef, node);
		},
		[externalViewportRef],
	);
	const isTouch = useTouchPrimary();
	useDragScroll(viewportRef, dragScroll);
	const contextValue = React.useMemo(
		() => ({ isTouch, type }),
		[isTouch, type],
	);

	const viewportClasses = cn(
		hideHorizontalScrollbar && "overflow-x-auto overflow-y-hidden",
		hideHorizontalScrollbar && scrollbarHiddenClass,
		dragScroll &&
			"cursor-grab pointer-coarse:cursor-auto touch-pan-x touch-pan-y select-none pointer-coarse:select-auto",
		viewportClassName,
	);
	const trackOverflow = maskHeight > 0 || onScrollStateChange != null;

	return (
		<ScrollAreaContext.Provider value={contextValue}>
			{isTouch ? (
				<div
					className={cn("relative overflow-hidden", className)}
					data-slot="scroll-area"
				>
					<div
						className={cn("size-full overflow-auto", viewportClasses)}
						ref={setViewportRef}
					>
						{children}
					</div>
					{trackOverflow ? (
						<ScrollOverflowState
							maskClassName={maskClassName}
							maskHeight={maskHeight}
							onScrollStateChange={onScrollStateChange}
							viewport={viewportNode}
						/>
					) : null}
				</div>
			) : (
				<ScrollAreaPrimitive.Root
					className={cn("relative overflow-hidden", className)}
					data-slot="scroll-area"
					{...props}
				>
					<ScrollAreaPrimitive.Viewport
						className={cn(
							"size-full rounded-[inherit] outline-none",
							viewportClasses,
						)}
						data-slot="scroll-area-viewport"
						ref={setViewportRef}
					>
						<ScrollAreaPrimitive.Content>
							{children}
						</ScrollAreaPrimitive.Content>
					</ScrollAreaPrimitive.Viewport>
					<ScrollBar />
					{hideHorizontalScrollbar ? null : (
						<ScrollBar orientation="horizontal" />
					)}
					<ScrollAreaPrimitive.Corner />
					{trackOverflow ? (
						<ScrollOverflowState
							maskClassName={maskClassName}
							maskHeight={maskHeight}
							onScrollStateChange={onScrollStateChange}
							viewport={viewportNode}
						/>
					) : null}
				</ScrollAreaPrimitive.Root>
			)}
		</ScrollAreaContext.Provider>
	);
}

function ScrollOverflowState({
	maskClassName,
	maskHeight,
	onScrollStateChange,
	viewport,
}: {
	maskClassName?: string;
	maskHeight: number;
	onScrollStateChange?: (state: Mask) => void;
	viewport: HTMLDivElement | null;
}) {
	const [showMask, setShowMask] = React.useState<Mask>(hiddenMask);
	const showMaskRef = React.useRef(showMask);
	const onScrollStateChangeRef = React.useRef(onScrollStateChange);
	onScrollStateChangeRef.current = onScrollStateChange;

	React.useLayoutEffect(() => {
		if (typeof window === "undefined" || !viewport) {
			return;
		}

		let frame = 0;
		const apply = () => {
			frame = 0;
			const next = readOverflowMask(viewport);
			if (masksEqual(showMaskRef.current, next)) {
				return;
			}
			showMaskRef.current = next;
			setShowMask(next);
			onScrollStateChangeRef.current?.(next);
		};
		const schedule = () => {
			if (frame !== 0) {
				return;
			}
			frame = requestAnimationFrame(apply);
		};

		const controller = new AbortController();
		const resizeObserver = new ResizeObserver(schedule);
		resizeObserver.observe(viewport);
		const content = viewport.firstElementChild;
		if (content) {
			resizeObserver.observe(content);
		}
		viewport.addEventListener("scroll", schedule, {
			passive: true,
			signal: controller.signal,
		});
		window.addEventListener("resize", schedule, {
			passive: true,
			signal: controller.signal,
		});
		apply();

		return () => {
			controller.abort();
			resizeObserver.disconnect();
			if (frame !== 0) {
				cancelAnimationFrame(frame);
			}
		};
	}, [viewport]);

	if (maskHeight <= 0) {
		return null;
	}

	return (
		<ScrollMask
			className={maskClassName}
			maskHeight={maskHeight}
			showMask={showMask}
		/>
	);
}

function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
	const { isTouch, type } = React.useContext(ScrollAreaContext);
	if (isTouch) {
		return null;
	}
	return (
		<ScrollAreaPrimitive.Scrollbar
			className={cn(
				"flex touch-none select-none p-px transition-[colors,opacity] duration-150 ease-out hover:bg-muted dark:hover:bg-muted/50",
				orientation === "vertical" &&
					"h-full w-2.5 border-l border-l-transparent",
				orientation === "horizontal" &&
					"h-2.5 flex-col border-t border-t-transparent px-1 pr-1.25",
				type === "hover" && "opacity-0 data-hovering:opacity-100",
				type === "scroll" && "opacity-0 data-scrolling:opacity-100",
				className,
			)}
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			{...props}
		>
			<ScrollAreaPrimitive.Thumb
				className={cn(
					"relative flex-1 rounded-full bg-border transition-[scale]",
					orientation === "vertical" && "my-1 active:scale-y-95",
					orientation === "horizontal" && "active:scale-x-98",
				)}
				data-slot="scroll-area-thumb"
			/>
		</ScrollAreaPrimitive.Scrollbar>
	);
}

function ScrollMask({
	showMask,
	maskHeight,
	className,
	...props
}: React.ComponentProps<"div"> & {
	showMask: Mask;
	maskHeight: number;
}) {
	return (
		<>
			<div
				{...props}
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]",
					"before:absolute before:inset-x-0 before:top-0 before:transition-[height,opacity] before:duration-300 before:content-['']",
					"after:absolute after:inset-x-0 after:bottom-0 after:transition-[height,opacity] after:duration-300 after:content-['']",
					"before:h-(--top-fade-height) after:h-(--bottom-fade-height)",
					showMask.top ? "before:opacity-100" : "before:opacity-0",
					showMask.bottom ? "after:opacity-100" : "after:opacity-0",
					"before:bg-linear-to-b before:from-background before:to-transparent",
					"after:bg-linear-to-t after:from-background after:to-transparent",
					className,
				)}
				style={
					{
						"--top-fade-height": showMask.top ? `${maskHeight}px` : "0px",
						"--bottom-fade-height": showMask.bottom ? `${maskHeight}px` : "0px",
					} as React.CSSProperties
				}
			/>
			<div
				{...props}
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-0 z-10",
					"before:absolute before:inset-y-0 before:left-0 before:transition-[width,opacity] before:duration-300 before:content-['']",
					"after:absolute after:inset-y-0 after:right-0 after:transition-[width,opacity] after:duration-300 after:content-['']",
					"before:w-(--left-fade-width) after:w-(--right-fade-width)",
					showMask.left ? "before:opacity-100" : "before:opacity-0",
					showMask.right ? "after:opacity-100" : "after:opacity-0",
					"before:bg-linear-to-r before:from-background before:via-background/80 before:to-transparent",
					"after:bg-linear-to-l after:from-background after:via-background/80 after:to-transparent",
					className,
				)}
				style={
					{
						"--left-fade-width": showMask.left ? `${maskHeight}px` : "0px",
						"--right-fade-width": showMask.right ? `${maskHeight}px` : "0px",
					} as React.CSSProperties
				}
			/>
		</>
	);
}

export { ScrollArea, ScrollBar };
