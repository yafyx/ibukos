import { Button } from "@ibukos/ui/components/button";
import { cn } from "@ibukos/ui/lib/utils";
import type { ComponentProps } from "react";

const lineClass =
	"origin-center transition-transform duration-[160ms] ease-[var(--ease-in-out)] motion-reduce:transition-none";

export function HamburgerButton({
	className,
	open,
	...props
}: ComponentProps<typeof Button> & { open: boolean }) {
	return (
		<Button
			{...props}
			aria-expanded={open}
			aria-label={open ? "Tutup menu" : "Buka menu"}
			className={cn("size-11 lg:hidden lg:size-8", className)}
			size="icon"
			type="button"
			variant="outline"
		>
			<svg
				aria-hidden="true"
				className="pointer-events-none"
				fill="none"
				height={16}
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
				width={16}
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					className={cn(
						lineClass,
						"-translate-y-[7px] in-[[data-slot=button][aria-expanded=true]]:translate-y-0 in-[[data-slot=button][aria-expanded=true]]:rotate-[315deg]",
					)}
					d="M4 12L20 12"
				/>
				<path
					className={cn(
						lineClass,
						"in-[[data-slot=button][aria-expanded=true]]:rotate-45",
					)}
					d="M4 12H20"
				/>
				<path
					className={cn(
						lineClass,
						"in-[[data-slot=button][aria-expanded=true]]:translate-y-0 translate-y-[7px] in-[[data-slot=button][aria-expanded=true]]:rotate-[135deg]",
					)}
					d="M4 12H20"
				/>
			</svg>
		</Button>
	);
}
