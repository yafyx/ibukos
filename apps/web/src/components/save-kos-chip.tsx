"use client";

import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Toggle } from "@ibukos/ui/components/toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@ibukos/ui/components/tooltip";
import { cn } from "@ibukos/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

import { isKosSaved, toggleSavedKos } from "@/lib/saved-kos";

type SaveFeedbackKind = "save" | "remove";

const saveFeedbackDisplayMs: Record<SaveFeedbackKind, number> = {
	save: 1400,
	remove: 550,
};

const saveFeedbackCollapseMs: Record<SaveFeedbackKind, number> = {
	save: 200,
	remove: 0,
};

const saveChipToggleClass =
	"save-chip h-8 min-h-8 min-w-8 gap-0 overflow-hidden rounded-lg border border-border bg-background p-0 shadow-none before:shadow-none motion-reduce:transition-none sm:h-8 sm:min-h-8 data-pressed:!bg-background data-pressed:text-primary data-pressed:[&_svg_path]:fill-current data-pressed:[&_svg_path]:stroke-none dark:data-pressed:!bg-background";

function saveAriaLabel(saved: boolean, name?: string) {
	if (saved) {
		return name ? `Hapus ${name} dari simpanan` : "Hapus dari simpanan";
	}
	return name ? `Simpan ${name}` : "Simpan kos";
}

export function SaveKosChip({
	className,
	name,
	slug,
}: {
	className?: string;
	name?: string;
	slug: string;
}) {
	const [saved, setSaved] = useState(false);
	const [feedbackMotion, setFeedbackMotion] = useState<SaveFeedbackKind | null>(
		null,
	);
	const [feedbackLabel, setFeedbackLabel] = useState("");
	const [feedbackVisible, setFeedbackVisible] = useState(false);
	const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(null);

	useEffect(() => {
		setSaved(isKosSaved(slug));
	}, [slug]);

	useEffect(() => {
		return () => {
			if (feedbackTimer.current) {
				clearTimeout(feedbackTimer.current);
			}
		};
	}, []);

	const dismissSaveFeedback = (kind: SaveFeedbackKind) => {
		setFeedbackVisible(false);
		feedbackTimer.current = setTimeout(() => {
			setFeedbackMotion(null);
			setFeedbackLabel("");
		}, saveFeedbackCollapseMs[kind]);
	};

	const showSaveFeedback = (kind: SaveFeedbackKind, message: string) => {
		if (feedbackTimer.current) {
			clearTimeout(feedbackTimer.current);
		}
		setFeedbackMotion(kind);
		setFeedbackLabel(message);
		setFeedbackVisible(true);
		feedbackTimer.current = setTimeout(
			() => dismissSaveFeedback(kind),
			saveFeedbackDisplayMs[kind],
		);
	};

	return (
		<span className={cn("inline-flex shrink-0 self-center", className)}>
			<Tooltip>
				<TooltipTrigger
					render={
						<Toggle
							aria-label={feedbackLabel || saveAriaLabel(saved, name)}
							className={cn(
								saveChipToggleClass,
								feedbackMotion === "save"
									? "save-chip--expanded save-chip--save"
									: "save-chip--collapsed",
								feedbackMotion === "remove" && "save-chip--remove",
							)}
							data-feedback={feedbackMotion ?? undefined}
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
							}}
							onPressedChange={() => {
								const nextSaved = toggleSavedKos(slug);
								setSaved(nextSaved);
								showSaveFeedback(
									nextSaved ? "save" : "remove",
									nextSaved ? "Disimpan" : "",
								);
							}}
							pressed={saved}
							variant="outline"
						>
							<HugeiconsIcon
								aria-hidden="true"
								className={cn(
									"save-chip-icon size-4 shrink-0",
									feedbackMotion === "remove" && "save-chip-icon--remove",
								)}
								icon={Bookmark02Icon}
								strokeWidth={1.5}
							/>
							{feedbackMotion === "remove" ? (
								<span aria-live="polite" className="sr-only">
									Dihapus dari simpanan
								</span>
							) : null}
							{feedbackMotion === "save" ? (
								<span
									aria-live="polite"
									className={cn(
										"save-chip-label save-chip-label--save",
										feedbackVisible
											? "save-chip-label--visible"
											: "save-chip-label--hidden",
									)}
								>
									{feedbackLabel}
								</span>
							) : null}
						</Toggle>
					}
				/>
				<TooltipContent>{saveAriaLabel(saved, name)}</TooltipContent>
			</Tooltip>
		</span>
	);
}
