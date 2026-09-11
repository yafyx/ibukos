"use client";

import type { ReactNode } from "react";

// Same tail as the Next.js dev tools notch: 60x42 S-curve, exported from
// Figma, rendered as SVG so the HTML box next to it can grow freely.
const curve =
	"C15.772 0 22.784 4.413 26.111 11.35L34.889 29.65C38.216 36.587 45.228 41 52.922 41";
// Tab side of the S (left of the curve), down to the folder body.
const tabSide = `M0 0H8.078${curve}V42H0Z`;
const curveStroke = `M8.078 0.5C15.772 0.5${curve.slice("C15.772 0".length)}`;

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
			<FolderNotchTail side="start" />
			<div className="promo-folder-notch-content" data-flip="x">
				{/* Fill + top edge live here so they can stretch when the notch
				    rises, without ever scaling the label. */}
				<span aria-hidden="true" className="promo-folder-notch-fill" data-flip="" />
				{children}
			</div>
			<FolderNotchTail side="end" />
		</div>
	);
}

function FolderNotchTail({ side }: { side: "start" | "end" }) {
	return (
		<>
			<svg
				aria-hidden="true"
				className="promo-folder-notch-tail"
				data-flip=""
				data-side={side}
				fill="none"
				height="42"
				preserveAspectRatio="none"
				viewBox="0 0 60 42"
				width="60"
			>
				{/* Mirror inside the SVG so CSS transform stays free for FLIP. */}
				<g transform={side === "start" ? "matrix(-1 0 0 1 60 0)" : undefined}>
					<path d={tabSide} fill="var(--tab-fill)" />
					<path
						d={curveStroke}
						stroke="var(--tail-stroke)"
						strokeWidth="1"
						vectorEffect="non-scaling-stroke"
					/>
				</g>
			</svg>
			{/* Neighbour's top line over the crook, pinned to the row top even
			    when this city is raised. */}
			<span
				aria-hidden="true"
				className="promo-folder-notch-crook"
				data-flip=""
				data-side={side}
			/>
		</>
	);
}
