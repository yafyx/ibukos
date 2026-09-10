"use client";

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ibukos/ui/components/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@ibukos/ui/components/input-group";
import { cn } from "@ibukos/ui/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";

import { createEmptyQuery } from "@/domain/facets/url";

export function LocationSearch({
	className,
	size,
}: {
	className?: string;
	size: "hero" | "chrome";
}) {
	const navigate = useNavigate();
	const current = useSearch({ strict: false }) as { q?: string };
	const [draft, setDraft] = useState(current.q ?? "");
	const hero = size === "hero";

	useEffect(() => {
		setDraft(current.q ?? "");
	}, [current.q]);

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		const q = draft.trim();
		navigate({
			search: q ? { ...createEmptyQuery(), q } : createEmptyQuery(),
			to: "/cari",
		});
	}

	return (
		<form className={cn("w-full", className)} onSubmit={handleSubmit}>
			<InputGroup
				className={cn("w-full bg-background", hero ? "h-12 max-w-xl" : "h-8")}
			>
				<InputGroupInput
					aria-label="Cari lokasi, area, atau kampus"
					onChange={(event) => setDraft(event.target.value)}
					placeholder="Masukkan nama lokasi, area, atau alamat"
					type="search"
					value={draft}
				/>
				<InputGroupAddon>
					<HugeiconsIcon aria-hidden="true" icon={Search01Icon} />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					{draft ? (
						<InputGroupButton
							aria-label="Hapus pencarian"
							onClick={() => setDraft("")}
							size="icon-xs"
						>
							<HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} />
						</InputGroupButton>
					) : null}
					<Button size={hero ? "lg" : "sm"} type="submit">
						Cari
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}
