/** Press feedback on the element itself (links, tiles). */
export const pressable =
	"transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

/** Press feedback on a container that holds buttons/links/toggles. */
export const pressableGroup =
	"transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] has-[[data-slot=button]:active]:scale-100 has-[button:active]:scale-100 has-[a:active]:scale-100 has-[[role=button]:active]:scale-100 has-[[data-slot=toggle]:active]:scale-100 has-[[data-slot=carousel]:active]:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100";

export const hoverable =
	"@media (hover:hover) and (pointer:fine) { &:hover { transform: scale(1.02) } }";

export const pinHoverable =
	"@media (hover:hover) and (pointer:fine) { &:hover { transform: scale(1.06) } }";

export const viewEnter = "view-enter";

export function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
