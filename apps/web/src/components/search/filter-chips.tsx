"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@ibukos/ui/components/badge";
import { Button } from "@ibukos/ui/components/button";
import { ScrollArea } from "@ibukos/ui/components/scroll-area";
import { useNavigate } from "@tanstack/react-router";

import type { ActiveChip } from "@/domain/facets/types";
import { createEmptyQuery } from "@/domain/facets/url";
import type { CariView } from "@/domain/geo";

export function FilterChips({
	chips,
	view,
}: {
	chips: ActiveChip[];
	view: CariView;
}) {
	const navigate = useNavigate();

	if (chips.length === 0) {
		return null;
	}

	return (
		<div className="flex min-w-0 items-center gap-2">
			<ScrollArea
				className="min-w-0 flex-1"
				dragScroll
				hideHorizontalScrollbar
				maskHeight={20}
			>
				<div className="flex w-max gap-2 py-0.5">
					{chips.map((chip) => (
						<Badge
							className="h-7 gap-1 px-2.5 text-xs"
							key={`${chip.facetId}-${chip.label}`}
							render={
								<button
									aria-label={`Hapus filter ${chip.label}`}
									onClick={() => navigate({ search: chip.next, to: "/cari" })}
									type="button"
								/>
							}
							variant="outline"
						>
							{chip.label}
							<HugeiconsIcon
								aria-hidden="true"
								className="size-3"
								icon={Cancel01Icon}
							/>
						</Badge>
					))}
				</div>
			</ScrollArea>
			{chips.length > 1 ? (
				<Button
					className="shrink-0"
					onClick={() =>
						navigate({
							search: { ...createEmptyQuery(), view },
							to: "/cari",
						})
					}
					size="sm"
					type="button"
					variant="ghost"
				>
					Hapus semua
				</Button>
			) : null}
		</div>
	);
}
