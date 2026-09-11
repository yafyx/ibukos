"use client";

import { Button } from "@ibukos/ui/components/button";
import { Calendar } from "@ibukos/ui/components/calendar";
import { Field, FieldLabel } from "@ibukos/ui/components/field";
import { Form } from "@ibukos/ui/components/form";
import { Input } from "@ibukos/ui/components/input";
import {
	Popover,
	PopoverPopup,
	PopoverTrigger,
} from "@ibukos/ui/components/popover";
import { Textarea } from "@ibukos/ui/components/textarea";
import { cn } from "@ibukos/ui/lib/utils";
import type { FormEvent } from "react";
import { toast } from "sonner";

import type { KosDetail } from "@/domain/kos/types";
import { viewEnter } from "@/lib/motion";

export function InquireForm({
	listing,
	open,
	onOpenChange,
	pickingDate,
	onPickingDateChange,
	moveIn,
	onMoveInChange,
	className,
}: {
	listing: KosDetail;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	pickingDate: boolean;
	onPickingDateChange: (picking: boolean) => void;
	moveIn: Date | undefined;
	onMoveInChange: (date: Date | undefined) => void;
	className?: string;
}) {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const nama = String(data.get("nama") ?? "").trim();
		if (!nama) {
			return;
		}
		toast.success(`Pesan terkirim ke ${listing.ownerLabel}`);
		onOpenChange(false);
		onPickingDateChange(false);
	}

	const moveInLabel = moveIn
		? new Intl.DateTimeFormat("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(moveIn)
		: "Pilih tanggal";

	return (
		<Popover
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					onPickingDateChange(false);
				}
			}}
			open={open}
		>
			<PopoverTrigger
				render={
					<Button
						className={cn(
							"h-11 min-w-36 flex-1 text-sm lg:h-9 lg:w-full lg:min-w-0",
							className,
						)}
					/>
				}
			>
				Tanya ketersediaan
			</PopoverTrigger>
			<PopoverPopup
				align="end"
				className={cn(
					pickingDate
						? "w-auto max-w-[calc(100vw-2rem)]"
						: "w-[min(20rem,calc(100vw-2rem))]",
				)}
				side="top"
			>
				{pickingDate ? (
					<div className={cn(viewEnter, "flex w-auto flex-col gap-2")}>
						<Button
							className="self-start"
							onClick={() => onPickingDateChange(false)}
							size="sm"
							type="button"
							variant="ghost"
						>
							Kembali
						</Button>
						<Calendar
							mode="single"
							onSelect={(date) => {
								onMoveInChange(date);
								onPickingDateChange(false);
							}}
							selected={moveIn}
						/>
					</div>
				) : (
					<Form
						className={cn(viewEnter, "flex w-full flex-col gap-3")}
						onSubmit={handleSubmit}
					>
						<p className="font-heading font-medium text-sm">
							Hubungi {listing.ownerLabel}
						</p>
						<Field>
							<FieldLabel>Nama</FieldLabel>
							<Input autoComplete="name" name="nama" required />
						</Field>
						<Field>
							<FieldLabel>Nomor WhatsApp</FieldLabel>
							<Input
								autoComplete="tel"
								inputMode="tel"
								name="telepon"
								required
								type="tel"
							/>
						</Field>
						<Field className="w-full">
							<FieldLabel>Tanggal masuk</FieldLabel>
							<Button
								className="w-full justify-start font-normal"
								onClick={() => onPickingDateChange(true)}
								type="button"
								variant="outline"
							>
								{moveInLabel}
							</Button>
						</Field>
						<Field>
							<FieldLabel>Pesan</FieldLabel>
							<Textarea
								name="pesan"
								placeholder={`Saya tertarik dengan ${listing.name}`}
								rows={3}
							/>
						</Field>
						<Button type="submit">Kirim</Button>
					</Form>
				)}
			</PopoverPopup>
		</Popover>
	);
}
