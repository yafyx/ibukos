import type { ReactNode } from "react";

export function SectionHeader({
	action,
	id,
	title,
}: {
	action?: ReactNode;
	id?: string;
	title: string;
}) {
	return (
		<div className="flex h-8 flex-wrap items-center justify-between gap-x-3 gap-y-2">
			<h2
				className="text-pretty font-heading font-semibold text-lg tracking-tight"
				id={id}
			>
				{title}
			</h2>
			{action ? <div className="shrink-0">{action}</div> : null}
		</div>
	);
}
