"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@ibukos/ui/components/badge";
import { ScrollArea } from "@ibukos/ui/components/scroll-area";
import { useNavigate } from "@tanstack/react-router";

import type { ActiveChip } from "@/domain/facets/types";

export function FilterChips({ chips }: { chips: ActiveChip[] }) {
	const navigate = useNavigate();

	if (chips.length === 0) {
		return null;
	}

	return (
		<ScrollArea className="w-full" maskHeight={20}>
			<div className="flex gap-2 pb-1">
				{chips.map((chip) => (
					<Badge
						className="gap-1 pe-0.5"
						key={`${chip.facetId}-${chip.label}`}
						variant="outline"
					>
						{chip.label}
						<button
							aria-label={`Hapus filter ${chip.label}`}
							className="-my-px -me-0.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
							onClick={() => navigate({ search: chip.next, to: "/cari" })}
							type="button"
						>
							<HugeiconsIcon
								aria-hidden="true"
								className="size-3"
								icon={Cancel01Icon}
							/>
						</button>
					</Badge>
				))}
			</div>
		</ScrollArea>
	);
}
