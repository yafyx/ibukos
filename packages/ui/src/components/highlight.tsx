"use client";

import { cn } from "@ibukos/ui/lib/utils";
import {
	AnimatePresence,
	motion,
	type Transition,
	useReducedMotion,
} from "motion/react";
import * as React from "react";

type Bounds = {
	top: number;
	left: number;
	width: number;
	height: number;
};

type HighlightContextValue = {
	hover: boolean;
	activeValue: string | null;
	setActiveValue: (value: string | null) => void;
	setBounds: (bounds: DOMRect) => void;
	clearBounds: () => void;
	setActiveClassName: (className: string) => void;
};

const HighlightContext = React.createContext<HighlightContextValue | null>(
	null,
);

function useHighlight(): HighlightContextValue {
	const context = React.useContext(HighlightContext);
	if (!context) {
		throw new Error("HighlightItem must be used within Highlight");
	}
	return context;
}

const defaultTransition: Transition = {
	type: "spring",
	bounce: 0,
	stiffness: 500,
	damping: 35,
};

export function Highlight({
	children,
	className,
	containerClassName,
	hover = false,
	style,
	transition = defaultTransition,
}: {
	children: React.ReactNode;
	className?: string;
	containerClassName?: string;
	hover?: boolean;
	style?: React.CSSProperties;
	transition?: Transition;
	mode?: "parent" | "children";
	controlledItems?: boolean;
}): React.ReactElement {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();
	const [activeValue, setActiveValue] = React.useState<string | null>(null);
	const [bounds, setBoundsState] = React.useState<Bounds | null>(null);
	const [activeClassName, setActiveClassName] = React.useState("");

	const setBounds = React.useCallback((next: DOMRect) => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const origin = container.getBoundingClientRect();
		const mapped: Bounds = {
			top: next.top - origin.top,
			left: next.left - origin.left,
			width: next.width,
			height: next.height,
		};
		setBoundsState((previous) => {
			if (
				previous &&
				previous.top === mapped.top &&
				previous.left === mapped.left &&
				previous.width === mapped.width &&
				previous.height === mapped.height
			) {
				return previous;
			}
			return mapped;
		});
	}, []);

	const clearBounds = React.useCallback(() => {
		setBoundsState(null);
	}, []);

	const context = React.useMemo(
		() => ({
			hover,
			activeValue,
			setActiveValue,
			setBounds,
			clearBounds,
			setActiveClassName,
		}),
		[activeValue, clearBounds, hover, setBounds],
	);

	const motionTransition = reducedMotion ? { duration: 0 } : transition;

	return (
		<HighlightContext.Provider value={context}>
			<div
				className={cn("relative", containerClassName)}
				data-slot="motion-highlight-container"
				ref={containerRef}
			>
				<AnimatePresence initial={false}>
					{bounds ? (
						<motion.div
							animate={{
								opacity: 1,
								x: bounds.left,
								y: bounds.top,
								width: bounds.width,
								height: bounds.height,
							}}
							className={cn(
								"pointer-events-none absolute top-0 left-0 z-0 bg-muted",
								className,
								activeClassName,
							)}
							data-slot="motion-highlight"
							exit={{ opacity: 0 }}
							initial={{
								opacity: 0,
								x: bounds.left,
								y: bounds.top,
								width: bounds.width,
								height: bounds.height,
							}}
							style={style}
							transition={motionTransition}
						/>
					) : null}
				</AnimatePresence>
				{children}
			</div>
		</HighlightContext.Provider>
	);
}

type HighlightChildProps = {
	className?: string;
	id?: string;
	ref?: React.Ref<HTMLElement>;
	onMouseEnter?: React.MouseEventHandler<HTMLElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLElement>;
	onClick?: React.MouseEventHandler<HTMLElement>;
	"data-value"?: string;
	"data-active"?: string;
	"data-highlight"?: boolean;
	"data-slot"?: string;
};

function isHighlightChild(
	element: React.ReactElement,
): element is React.ReactElement<HighlightChildProps> {
	return typeof element.props === "object" && element.props !== null;
}

export function HighlightItem({
	children,
	value,
	asChild = false,
	activeClassName,
}: {
	children: React.ReactNode;
	value?: string;
	asChild?: boolean;
	activeClassName?: string;
}): React.ReactElement {
	const itemId = React.useId();
	const localRef = React.useRef<HTMLElement | null>(null);
	const {
		hover,
		activeValue,
		setActiveValue,
		setBounds,
		clearBounds,
		setActiveClassName,
	} = useHighlight();
	const childValue = value ?? itemId;
	const isActive = activeValue === childValue;

	React.useEffect(() => {
		if (isActive && localRef.current) {
			setBounds(localRef.current.getBoundingClientRect());
			setActiveClassName(activeClassName ?? "");
			return;
		}
		if (!activeValue) {
			clearBounds();
		}
	}, [
		activeClassName,
		activeValue,
		clearBounds,
		isActive,
		setActiveClassName,
		setBounds,
	]);

	const setRef = React.useCallback((node: HTMLElement | null) => {
		localRef.current = node;
	}, []);

	const child = React.Children.only(children);
	if (!asChild || !React.isValidElement(child) || !isHighlightChild(child)) {
		return <>{children}</>;
	}

	const previousEnter = child.props.onMouseEnter;
	const previousLeave = child.props.onMouseLeave;
	const previousRef = child.props.ref;

	return React.cloneElement(child, {
		"data-active": isActive ? "true" : "false",
		"data-highlight": true,
		"data-slot": "motion-highlight-item",
		"data-value": childValue,
		ref: (node: HTMLElement | null) => {
			setRef(node);
			if (typeof previousRef === "function") {
				previousRef(node);
			} else if (previousRef) {
				previousRef.current = node;
			}
		},
		onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
			if (hover) {
				setActiveValue(childValue);
			}
			previousEnter?.(event);
		},
		onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
			if (hover) {
				setActiveValue(null);
			}
			previousLeave?.(event);
		},
	});
}

export { useHighlight };
