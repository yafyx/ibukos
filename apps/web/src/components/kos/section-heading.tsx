import type { ReactNode } from "react";

export function SectionHeading({
	action,
	children,
}: {
	action?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="flex h-8 items-center justify-between gap-2">
			<h2 className="font-heading font-semibold text-sm tracking-tight">
				{children}
			</h2>
			{action}
		</div>
	);
}
