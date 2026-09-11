"use client";

import type { ReactNode } from "react";

export function FolderNotch({
	active = false,
	children,
}: {
	active?: boolean;
	children: ReactNode;
}) {
	return (
		<div
			className="promo-folder-notch"
			data-active={active ? "true" : undefined}
		>
			<div className="promo-folder-notch-content">{children}</div>
			<FolderNotchTail />
		</div>
	);
}

function FolderNotchTail() {
	return (
		<svg
			aria-hidden="true"
			className="promo-folder-notch-tail"
			fill="none"
			height="42"
			preserveAspectRatio="none"
			viewBox="0 0 60 42"
			width="60"
		>
			<path
				d="M1 0H8.078C15.772 0 22.784 4.413 26.111 11.35L34.889 29.65C38.216 36.587 45.228 41 52.922 41H60V42H1Z"
				fill="var(--background-color)"
			/>
			<path
				d="M1 0.5H8.078C15.772 0.5 22.784 4.413 26.111 11.35L34.889 29.65C38.216 36.587 45.228 41 52.922 41H60"
				stroke="var(--stroke-color)"
				strokeWidth="1"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}
