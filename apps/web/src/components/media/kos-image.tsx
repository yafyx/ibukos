"use client";

import { cn } from "@ibukos/ui/lib/utils";
import { useEffect, useState, type ComponentProps } from "react";

const FALLBACK_SRC =
	"data:image/svg+xml;charset=utf-8," +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
			<rect width="400" height="300" fill="#e7e7e7"/>
			<rect x="130" y="96" width="140" height="108" rx="8" stroke="#8d8d8d" stroke-width="6"/>
			<path d="M130 188l40-36 28 24 24-32 52 44" stroke="#8d8d8d" stroke-width="6" stroke-linejoin="round"/>
			<circle cx="168" cy="128" r="10" fill="#8d8d8d"/>
		</svg>`,
	);

type KosImageProps = Omit<ComponentProps<"img">, "src"> & {
	src?: string | null;
};

export function KosImage({ alt = "", className, src, ...props }: KosImageProps) {
	const [failed, setFailed] = useState(!src);

	useEffect(() => {
		setFailed(!src);
	}, [src]);

	return (
		<img
			alt={alt}
			className={cn(failed && "bg-muted object-contain", className)}
			onError={() => {
				if (!failed) {
					setFailed(true);
				}
			}}
			src={failed ? FALLBACK_SRC : (src ?? undefined)}
			{...props}
		/>
	);
}
