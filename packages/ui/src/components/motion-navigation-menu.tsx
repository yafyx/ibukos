"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Highlight, HighlightItem } from "@ibukos/ui/components/highlight";
import { cn } from "@ibukos/ui/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

type Spring = {
	type: "spring";
	stiffness?: number;
	damping?: number;
	bounce: number;
};

type ContentRecord = {
	children: React.ReactNode;
	className?: string;
	highlightClassName?: string;
	innerClassName?: string;
};

type OpenOptions = {
	instant?: boolean;
};

type MotionNavigationMenuContextValue = {
	activeValue: string;
	direction: number;
	spring: Spring | { duration: number };
	viewport: boolean;
	viewportX: number | null;
	openValue: (value: string, options?: OpenOptions) => void;
	closeMenu: (options?: OpenOptions) => void;
	registerContent: (value: string, content: ContentRecord) => () => void;
	updateViewportPosition: () => void;
};

type MotionNavigationMenuItemContextValue = {
	value?: string;
};

const MotionNavigationMenuContext =
	React.createContext<MotionNavigationMenuContextValue | null>(null);

const MotionNavigationMenuItemContext =
	React.createContext<MotionNavigationMenuItemContextValue | null>(null);

const contentVariants = {
	initial: (direction: number) => ({ x: `${100 * direction}%`, opacity: 0 }),
	active: { x: "0%", opacity: 1 },
	exit: (direction: number) => ({ x: `${-100 * direction}%`, opacity: 0 }),
};

type MotionNavigationMenuProps = Omit<
	React.ComponentPropsWithRef<"nav">,
	"onValueChange"
> & {
	viewport?: boolean;
	viewportClassName?: string;
	springBounce?: number;
	springStiffness?: number;
	springDamping?: number;
	value?: string;
	onValueChange?: (value: string) => void;
};

function MotionNavigationMenu({
	className,
	children,
	viewport = true,
	viewportClassName,
	springBounce = 0,
	springStiffness = 350,
	springDamping = 32,
	value,
	onValueChange,
	onPointerLeave,
	onKeyDown,
	ref,
	...props
}: MotionNavigationMenuProps) {
	const rootRef = React.useRef<HTMLElement | null>(null);
	const frameRef = React.useRef<number | null>(null);
	const lastActiveValueRef = React.useRef(value ?? "");
	const isControlled = value !== undefined;
	const reducedMotion = useReducedMotion();
	const [internalValue, setInternalValue] = React.useState("");
	const [direction, setDirection] = React.useState(1);
	const [instant, setInstant] = React.useState(false);
	const [viewportX, setViewportX] = React.useState<number | null>(null);
	const [contentByValue, setContentByValue] = React.useState<
		Record<string, ContentRecord>
	>({});

	const activeValue = value ?? internalValue;

	const spring = React.useMemo<Spring>(
		() => ({
			type: "spring",
			bounce: springBounce,
			stiffness: springStiffness,
			damping: springDamping,
		}),
		[springBounce, springDamping, springStiffness],
	);

	const motionSpring = reducedMotion || instant ? { duration: 0 } : spring;

	const getItemValues = React.useCallback(() => {
		const root = rootRef.current;
		if (!root) {
			return [];
		}
		const values: string[] = [];
		for (const item of root.querySelectorAll<HTMLElement>(
			'[data-slot="navigation-menu-item"][data-value]',
		)) {
			const next = item.dataset.value;
			if (next) {
				values.push(next);
			}
		}
		return values;
	}, []);

	const updateViewportPosition = React.useCallback(() => {
		if (frameRef.current !== null) {
			cancelAnimationFrame(frameRef.current);
		}

		frameRef.current = requestAnimationFrame(() => {
			const root = rootRef.current;
			if (!root) {
				return;
			}

			const rootRect = root.getBoundingClientRect();
			const activeTrigger = root.querySelector<HTMLElement>(
				'[data-slot="navigation-menu-trigger"][data-state="open"]',
			);

			if (!activeTrigger) {
				setViewportX(rootRect.width / 2);
				return;
			}

			const triggerRect = activeTrigger.getBoundingClientRect();
			const idealX = triggerRect.left - rootRect.left + triggerRect.width / 2;
			const measureEl = root.querySelector<HTMLElement>(
				'[data-slot="navigation-menu-measure"]',
			);
			const viewportEl = root.querySelector<HTMLElement>(
				'[data-slot="navigation-menu-viewport"]',
			);
			const contentWidth =
				(measureEl ? measureEl.offsetWidth : 0) ||
				(viewportEl ? viewportEl.offsetWidth : 0);
			const half = contentWidth / 2;

			if (contentWidth > 0) {
				let boundary: DOMRect | null = null;
				let ancestor = root.parentElement;
				while (ancestor && ancestor !== document.body) {
					const style = window.getComputedStyle(ancestor);
					const overflow = style.overflow + style.overflowX;
					if (/hidden|clip|scroll|auto/.test(overflow)) {
						boundary = ancestor.getBoundingClientRect();
						break;
					}
					ancestor = ancestor.parentElement;
				}
				if (!boundary) {
					boundary = document.documentElement.getBoundingClientRect();
				}

				const margin = 8;
				const dropLeft = rootRect.left + idealX - half;
				const dropRight = rootRect.left + idealX + half;
				let adjustment = 0;
				if (dropLeft < boundary.left + margin) {
					adjustment = boundary.left + margin - dropLeft;
				} else if (dropRight > boundary.right - margin) {
					adjustment = boundary.right - margin - dropRight;
				}
				setViewportX(idealX + adjustment);
			} else {
				setViewportX(idealX);
			}
		});
	}, []);

	const setRootRef = React.useCallback(
		(node: HTMLElement | null) => {
			rootRef.current = node;
			if (typeof ref === "function") {
				ref(node);
			} else if (ref) {
				ref.current = node;
			}
		},
		[ref],
	);

	const setActiveValue = React.useCallback(
		(nextValue: string) => {
			if (!isControlled) {
				setInternalValue(nextValue);
			}
			onValueChange?.(nextValue);
		},
		[isControlled, onValueChange],
	);

	const openValue = React.useCallback(
		(nextValue: string, options?: OpenOptions) => {
			if (!nextValue || nextValue === lastActiveValueRef.current) {
				return;
			}

			setInstant(Boolean(options?.instant));
			const itemValues = getItemValues();
			const previousIndex = itemValues.indexOf(lastActiveValueRef.current);
			const nextIndex = itemValues.indexOf(nextValue);
			if (previousIndex !== -1 && nextIndex !== -1) {
				setDirection(nextIndex > previousIndex ? 1 : -1);
			}

			lastActiveValueRef.current = nextValue;
			setActiveValue(nextValue);
			updateViewportPosition();
		},
		[getItemValues, setActiveValue, updateViewportPosition],
	);

	const closeMenu = React.useCallback(
		(options?: OpenOptions) => {
			setInstant(Boolean(options?.instant));
			lastActiveValueRef.current = "";
			setActiveValue("");
			updateViewportPosition();
		},
		[setActiveValue, updateViewportPosition],
	);

	const registerContent = React.useCallback(
		(itemValue: string, content: ContentRecord) => {
			setContentByValue((current) => {
				const previous = current[itemValue];
				if (
					previous?.children === content.children &&
					previous?.className === content.className &&
					previous?.innerClassName === content.innerClassName
				) {
					return current;
				}
				return { ...current, [itemValue]: content };
			});

			return () => {
				setContentByValue((current) => {
					if (!current[itemValue]) {
						return current;
					}
					const next = { ...current };
					delete next[itemValue];
					return next;
				});
			};
		},
		[],
	);

	React.useEffect(() => {
		if (value === undefined) {
			return;
		}
		if (!value) {
			lastActiveValueRef.current = "";
			return;
		}
		openValue(value);
	}, [openValue, value]);

	React.useLayoutEffect(() => {
		if (!activeValue) {
			updateViewportPosition();
			return;
		}
		updateViewportPosition();
	}, [activeValue, updateViewportPosition]);

	React.useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root || typeof ResizeObserver === "undefined") {
			return () => {
				if (frameRef.current !== null) {
					cancelAnimationFrame(frameRef.current);
				}
			};
		}
		const observer = new ResizeObserver(updateViewportPosition);
		observer.observe(root);
		return () => {
			observer.disconnect();
			if (frameRef.current !== null) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, [updateViewportPosition]);

	React.useEffect(() => {
		function handlePointerDown(event: PointerEvent) {
			if (
				rootRef.current &&
				event.target instanceof Node &&
				!rootRef.current.contains(event.target)
			) {
				closeMenu();
			}
		}
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [closeMenu]);

	const contextValue = React.useMemo(
		() => ({
			activeValue,
			direction,
			spring: motionSpring,
			viewport,
			viewportX,
			openValue,
			closeMenu,
			registerContent,
			updateViewportPosition,
		}),
		[
			activeValue,
			closeMenu,
			direction,
			motionSpring,
			openValue,
			registerContent,
			updateViewportPosition,
			viewport,
			viewportX,
		],
	);

	return (
		<MotionNavigationMenuContext.Provider value={contextValue}>
			<nav
				className={cn(
					"group/navigation-menu relative flex max-w-max items-center justify-center",
					className,
				)}
				data-slot="navigation-menu"
				data-viewport={viewport}
				onKeyDown={(event) => {
					onKeyDown?.(event);
					if (event.key === "Escape") {
						closeMenu({ instant: true });
					}
				}}
				onPointerLeave={(event) => {
					onPointerLeave?.(event);
					closeMenu();
				}}
				ref={setRootRef}
				{...props}
			>
				{children}
				{viewport ? (
					<MotionNavigationMenuViewport
						className={viewportClassName}
						contentByValue={contentByValue}
					/>
				) : null}
			</nav>
		</MotionNavigationMenuContext.Provider>
	);
}

function MotionNavigationMenuList({
	className,
	highlightClassName,
	...props
}: React.ComponentPropsWithRef<"ul"> & {
	highlightClassName?: string;
}) {
	return (
		<Highlight
			className={cn(
				"pointer-events-none rounded-md bg-accent",
				highlightClassName,
			)}
			containerClassName="relative"
			controlledItems
			hover
			mode="parent"
			style={{ zIndex: 0 }}
		>
			<ul
				className={cn(
					"group relative z-10 flex list-none items-center justify-center gap-0.5",
					className,
				)}
				data-slot="navigation-menu-list"
				{...props}
			/>
		</Highlight>
	);
}

function MotionNavigationMenuItem({
	className,
	value,
	...props
}: React.ComponentPropsWithRef<"li"> & {
	value?: string;
}) {
	const itemContextValue = React.useMemo(() => ({ value }), [value]);

	return (
		<MotionNavigationMenuItemContext.Provider value={itemContextValue}>
			<li
				className={cn("relative", className)}
				data-slot="navigation-menu-item"
				data-value={value}
				{...props}
			/>
		</MotionNavigationMenuItemContext.Provider>
	);
}

const motionNavigationMenuTriggerStyle = cva(
	"group inline-flex h-8 w-max items-center justify-center rounded-md bg-transparent px-2.5 font-medium text-sm outline-none transition-colors hover:text-accent-foreground focus:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground",
);

function MotionNavigationMenuTrigger({
	className,
	children,
	onPointerEnter,
	onFocus,
	onClick,
	...props
}: React.ComponentPropsWithRef<"button">) {
	const context = React.useContext(MotionNavigationMenuContext);
	const itemContext = React.useContext(MotionNavigationMenuItemContext);
	const value = itemContext?.value;
	const isOpen = Boolean(value && context?.activeValue === value);
	const reducedMotion = useReducedMotion();

	return (
		<HighlightItem asChild>
			<button
				aria-expanded={isOpen}
				className={cn(motionNavigationMenuTriggerStyle(), "group", className)}
				data-slot="navigation-menu-trigger"
				data-state={isOpen ? "open" : "closed"}
				onClick={(event) => {
					onClick?.(event);
					if (value) {
						context?.openValue(value);
					}
				}}
				onFocus={(event) => {
					onFocus?.(event);
					if (!value) {
						return;
					}
					if (event.currentTarget.matches(":focus-visible")) {
						context?.openValue(value, { instant: true });
						return;
					}
					context?.openValue(value);
				}}
				onPointerEnter={(event) => {
					onPointerEnter?.(event);
					if (value) {
						context?.openValue(value);
					}
				}}
				type="button"
				{...props}
			>
				{children}{" "}
				<motion.span
					animate={{
						rotate: isOpen ? 180 : 0,
						y: isOpen ? 1 : 0,
					}}
					aria-hidden="true"
					className="relative top-0 ms-1 inline-flex"
					transition={
						reducedMotion
							? { duration: 0 }
							: { type: "spring", stiffness: 400, damping: 20, bounce: 0 }
					}
				>
					<ChevronDownIcon aria-hidden="true" className="size-3.5" />
				</motion.span>
			</button>
		</HighlightItem>
	);
}

function MotionNavigationMenuContent({
	className,
	highlightClassName,
	innerClassName,
	children,
}: React.ComponentPropsWithRef<"div"> & {
	highlightClassName?: string;
	innerClassName?: string;
}) {
	const context = React.useContext(MotionNavigationMenuContext);
	const itemContext = React.useContext(MotionNavigationMenuItemContext);
	const value = itemContext?.value;
	const isOpen = Boolean(value && context?.activeValue === value);

	React.useLayoutEffect(() => {
		if (!context || !value || !context.viewport) {
			return;
		}
		return context.registerContent(value, {
			children,
			className,
			highlightClassName,
			innerClassName,
		});
	}, [children, className, context, highlightClassName, innerClassName, value]);

	if (!context || !value || context.viewport) {
		return null;
	}

	return (
		<AnimatePresence custom={context.direction} initial={false}>
			{isOpen ? (
				<motion.div
					animate="active"
					className={cn(
						"absolute top-full left-0 z-50 mt-1.5 rounded-md border bg-popover p-2 text-popover-foreground shadow",
						className,
					)}
					custom={context.direction}
					data-slot="navigation-menu-content"
					exit="exit"
					initial="initial"
					key={value}
					transition={context.spring}
					variants={contentVariants}
				>
					<MotionNavigationMenuContentInner
						highlightClassName={highlightClassName}
						innerClassName={innerClassName}
					>
						{children}
					</MotionNavigationMenuContentInner>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}

function MotionNavigationMenuContentInner({
	highlightClassName,
	innerClassName,
	children,
}: {
	highlightClassName?: string;
	innerClassName?: string;
	children: React.ReactNode;
}) {
	return (
		<Highlight
			className={cn(
				"pointer-events-none rounded-sm bg-accent",
				highlightClassName,
			)}
			containerClassName="relative"
			controlledItems
			hover
			mode="parent"
			style={{ zIndex: 0 }}
		>
			<div className={cn("relative z-10", innerClassName)}>{children}</div>
		</Highlight>
	);
}

function MotionNavigationMenuViewport({
	className,
	contentByValue,
}: React.ComponentPropsWithRef<"div"> & {
	contentByValue?: Record<string, ContentRecord>;
}) {
	const context = React.useContext(MotionNavigationMenuContext);
	const measureRef = React.useRef<HTMLDivElement | null>(null);
	const [size, setSize] = React.useState({ width: 0, height: 0 });
	const [lastSize, setLastSize] = React.useState({ width: 0, height: 0 });
	const activeContent =
		context?.activeValue && contentByValue
			? contentByValue[context.activeValue]
			: undefined;

	React.useLayoutEffect(() => {
		const node = measureRef.current;
		if (!node || !activeContent) {
			return;
		}

		const updateSize = () => {
			const rect = node.getBoundingClientRect();
			const nextSize = { width: rect.width, height: rect.height };
			setSize(nextSize);
			if (nextSize.width > 0 || nextSize.height > 0) {
				setLastSize(nextSize);
			}
			context?.updateViewportPosition();
		};

		updateSize();
		if (typeof ResizeObserver === "undefined") {
			return;
		}
		const observer = new ResizeObserver(updateSize);
		observer.observe(node);
		return () => observer.disconnect();
	}, [activeContent, context]);

	const width = size.width > 0 ? size.width : lastSize.width;
	const height = size.height > 0 ? size.height : lastSize.height;

	return (
		<motion.div
			animate={{ left: context?.viewportX ?? "50%" }}
			className="absolute top-full isolate z-50 flex -translate-x-1/2 justify-center"
			initial={false}
			transition={context?.spring}
		>
			<motion.div
				animate={{
					width: activeContent ? width : 0,
					height: activeContent ? height : 0,
					opacity: activeContent ? 1 : 0,
					scale: activeContent ? 1 : 0.97,
				}}
				className={cn(
					"relative mt-1.5 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow",
					className,
				)}
				data-slot="navigation-menu-viewport"
				initial={false}
				transition={context?.spring}
			>
				<AnimatePresence
					custom={context?.direction ?? 1}
					initial={false}
					mode="popLayout"
				>
					{activeContent && context?.activeValue ? (
						<motion.div
							animate="active"
							className={cn("p-2", activeContent.className)}
							custom={context.direction}
							data-slot="navigation-menu-content"
							exit="exit"
							initial="initial"
							key={context.activeValue}
							transition={context.spring}
							variants={contentVariants}
						>
							<MotionNavigationMenuContentInner
								highlightClassName={activeContent.highlightClassName}
								innerClassName={activeContent.innerClassName}
							>
								{activeContent.children}
							</MotionNavigationMenuContentInner>
						</motion.div>
					) : null}
				</AnimatePresence>
			</motion.div>

			<div
				aria-hidden="true"
				className="pointer-events-none invisible absolute top-1.5 left-0 w-max"
				data-slot="navigation-menu-measure"
				ref={measureRef}
			>
				{activeContent ? (
					<div className={cn("p-2", activeContent.className)}>
						<MotionNavigationMenuContentInner
							highlightClassName={activeContent.highlightClassName}
							innerClassName={activeContent.innerClassName}
						>
							{activeContent.children}
						</MotionNavigationMenuContentInner>
					</div>
				) : null}
			</div>
		</motion.div>
	);
}

function MotionNavigationMenuLink({
	className,
	render,
	...props
}: useRender.ComponentProps<"a">): React.ReactElement {
	const context = React.useContext(MotionNavigationMenuContext);
	const element = useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"flex flex-col gap-1 rounded-sm p-2 text-sm outline-none transition-colors hover:text-accent-foreground focus:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring data-[active=true]:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
					className,
				),
				onClick: () => context?.closeMenu(),
			},
			props,
		),
		render,
	});
	return <HighlightItem asChild>{element}</HighlightItem>;
}

function MotionNavigationMenuIndicator({
	className,
	...props
}: React.ComponentPropsWithRef<"div">) {
	return (
		<div
			className={cn(
				"pointer-events-none top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
				className,
			)}
			data-slot="navigation-menu-indicator"
			{...props}
		>
			<div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
		</div>
	);
}

export {
	MotionNavigationMenu,
	MotionNavigationMenuContent,
	MotionNavigationMenuIndicator,
	MotionNavigationMenuItem,
	MotionNavigationMenuLink,
	MotionNavigationMenuList,
	MotionNavigationMenuTrigger,
	MotionNavigationMenuViewport,
	motionNavigationMenuTriggerStyle,
};

export default MotionNavigationMenu;
