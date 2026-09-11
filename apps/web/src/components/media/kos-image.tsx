"use client";

import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@ibukos/ui/lib/utils";
import { type ComponentProps, useEffect, useState } from "react";

type KosImageProps = Omit<ComponentProps<"img">, "src"> & {
	src?: string | null;
	fallbackText?: string;
};

export function KosImage({
	alt = "",
	className,
	decoding = "async",
	fallbackText,
	loading = "lazy",
	src,
	...props
}: KosImageProps) {
	const [failed, setFailed] = useState(!src);
	const label = fallbackText ?? alt;

	useEffect(() => {
		setFailed(!src);
	}, [src]);

	if (failed || !src) {
		if (!label) {
			return (
				<div
					aria-hidden={true}
					className={cn(
						"flex flex-col items-center justify-center gap-1.5 bg-muted px-2 text-muted-foreground",
						className,
					)}
				>
					<HugeiconsIcon
						aria-hidden="true"
						className="size-10 shrink-0 opacity-50"
						icon={Home01Icon}
						strokeWidth={1.5}
					/>
				</div>
			);
		}
		return (
			<div
				aria-label={label}
				className={cn(
					"flex flex-col items-center justify-center gap-1.5 bg-muted px-2 text-muted-foreground",
					className,
				)}
				role="img"
			>
				<HugeiconsIcon
					aria-hidden="true"
					className="size-10 shrink-0 opacity-50"
					icon={Home01Icon}
					strokeWidth={1.5}
				/>
				<span className="line-clamp-2 text-center font-medium text-xs leading-snug opacity-70">
					{label}
				</span>
			</div>
		);
	}

	return (
		<img
			alt={alt}
			className={className}
			decoding={decoding}
			draggable={false}
			loading={loading}
			onError={() => {
				setFailed(true);
			}}
			src={src}
			{...props}
		/>
	);
}
