"use client";

import { ScrollArea } from "@ibukos/ui/components/scroll-area";
import { Link } from "@tanstack/react-router";

import { KosImage } from "@/components/media/kos-image";
import { buildCariSearch } from "@/domain/facets/url";
import type { AreaTile } from "@/domain/kos/types";
import { pressable } from "@/lib/motion";

export function AreaRow({ title, tiles }: { title: string; tiles: AreaTile[] }) {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
			<ScrollArea className="w-full" maskHeight={24}>
				<div className="flex gap-3 pe-8 pb-2">
					{tiles.map((tile) => (
						<Link
							className={`relative w-52 shrink-0 overflow-hidden ${pressable}`}
							key={tile.slug}
							search={buildCariSearch(tile.query)}
							to="/cari"
						>
							<KosImage
								alt=""
								className="aspect-[4/3] size-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
								height={156}
								src={tile.image}
								width={208}
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
							<span className="absolute inset-e-3 inset-s-3 bottom-3 font-medium text-sm text-white">
								{tile.label}
							</span>
						</Link>
					))}
				</div>
			</ScrollArea>
		</section>
	);
}
