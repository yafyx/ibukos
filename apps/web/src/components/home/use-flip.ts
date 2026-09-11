import { type RefObject, useCallback, useLayoutEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/** On-screen movement: strong ease-in-out, under 300ms. */
const FLIP_EASING = "cubic-bezier(0.77, 0, 0.175, 1)";
const FLIP_DURATION_MS = 200;

type Snapshot = Map<HTMLElement, DOMRect>;

function flipTargets(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>("[data-flip]"));
}

/**
 * FLIP for `[data-flip]` descendants: call `prepare()` right before the
 * state change that re-lays them out, and they slide (and stretch) from
 * where they were to where they land. Transform only, so nothing re-lays out
 * during the animation. Interrupting mid-flight starts from the visual
 * position, not the layout one, so rapid switching never jumps.
 */
export function useFlip(
	containerRef: RefObject<HTMLElement | null>,
): () => void {
	const snapshot = useRef<Snapshot | null>(null);

	const prepare = useCallback(() => {
		const container = containerRef.current;
		if (!container || prefersReducedMotion()) {
			return;
		}
		const next: Snapshot = new Map();
		for (const element of flipTargets(container)) {
			// Measure first: the rect includes any transform still mid-flight.
			next.set(element, element.getBoundingClientRect());
			for (const animation of element.getAnimations()) {
				animation.cancel();
			}
		}
		snapshot.current = next;
	}, [containerRef]);

	// Runs after every commit; only does work when `prepare()` took a snapshot.
	useLayoutEffect(() => {
		const before = snapshot.current;
		snapshot.current = null;
		const container = containerRef.current;
		if (!before || !container) {
			return;
		}
		for (const element of flipTargets(container)) {
			const from = before.get(element);
			if (!from || from.width === 0) {
				continue;
			}
			const to = element.getBoundingClientRect();
			if (to.width === 0 || to.height === 0) {
				continue;
			}
			// `data-flip="x"` marks boxes holding text: slide them, never scale.
			const xOnly = element.dataset.flip === "x";
			const dx = from.left - to.left;
			const dy = xOnly ? 0 : from.top - to.top;
			const sx = xOnly ? 1 : from.width / to.width;
			const sy = xOnly ? 1 : from.height / to.height;
			if (
				Math.abs(dx) < 0.5 &&
				Math.abs(dy) < 0.5 &&
				Math.abs(sx - 1) < 0.01 &&
				Math.abs(sy - 1) < 0.01
			) {
				continue;
			}
			element.animate(
				[
					{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
					{ transform: "none" },
				],
				{ duration: FLIP_DURATION_MS, easing: FLIP_EASING },
			);
		}
	});

	return prepare;
}
