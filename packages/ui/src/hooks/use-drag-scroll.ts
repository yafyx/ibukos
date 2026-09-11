"use client";

import { type RefObject, useEffect, useRef } from "react";

/** Nested controls that keep their own pointer handling. */
const DRAG_SCROLL_BLOCK_SELECTOR =
	"a, [href], input, textarea, select, button, [role='button'], [role='link']";

export function useDragScroll(
	ref: RefObject<HTMLElement | null>,
	enabled = true,
) {
	const dragRef = useRef({
		active: false,
		pointerId: -1,
		startX: 0,
		scrollLeft: 0,
		moved: false,
	});

	useEffect(() => {
		const element = ref.current;
		if (!element || !enabled) {
			return;
		}

		const resetDrag = () => {
			dragRef.current.active = false;
			dragRef.current.pointerId = -1;
			element.classList.remove("cursor-grabbing");
		};

		const onPointerDown = (event: PointerEvent) => {
			// Touch/pen already scroll natively with momentum; only emulate for mouse.
			if (event.button !== 0 || event.pointerType !== "mouse") {
				return;
			}
			const target = event.target;
			if (!(target instanceof Element)) {
				return;
			}
			if (target.closest(DRAG_SCROLL_BLOCK_SELECTOR)) {
				return;
			}

			dragRef.current = {
				active: true,
				pointerId: event.pointerId,
				startX: event.clientX,
				scrollLeft: element.scrollLeft,
				moved: false,
			};
			element.setPointerCapture(event.pointerId);
			element.classList.add("cursor-grabbing");
		};

		const onPointerMove = (event: PointerEvent) => {
			if (
				!dragRef.current.active ||
				event.pointerId !== dragRef.current.pointerId
			) {
				return;
			}
			const delta = event.clientX - dragRef.current.startX;
			if (Math.abs(delta) > 4) {
				dragRef.current.moved = true;
				event.preventDefault();
			}
			element.scrollLeft = dragRef.current.scrollLeft - delta;
		};

		const onPointerEnd = (event: PointerEvent) => {
			if (
				!dragRef.current.active ||
				event.pointerId !== dragRef.current.pointerId
			) {
				return;
			}
			if (element.hasPointerCapture(event.pointerId)) {
				element.releasePointerCapture(event.pointerId);
			}
			resetDrag();
		};

		const onClickCapture = (event: MouseEvent) => {
			if (!dragRef.current.moved) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			dragRef.current.moved = false;
		};

		const onDragStart = (event: DragEvent) => {
			event.preventDefault();
		};

		element.addEventListener("pointerdown", onPointerDown, { capture: true });
		element.addEventListener("pointermove", onPointerMove, { passive: false });
		element.addEventListener("pointerup", onPointerEnd);
		element.addEventListener("pointercancel", onPointerEnd);
		element.addEventListener("click", onClickCapture, true);
		element.addEventListener("dragstart", onDragStart, true);

		return () => {
			element.removeEventListener("pointerdown", onPointerDown, {
				capture: true,
			});
			element.removeEventListener("pointermove", onPointerMove);
			element.removeEventListener("pointerup", onPointerEnd);
			element.removeEventListener("pointercancel", onPointerEnd);
			element.removeEventListener("click", onClickCapture, true);
			element.removeEventListener("dragstart", onDragStart, true);
			resetDrag();
		};
	}, [enabled, ref]);
}
