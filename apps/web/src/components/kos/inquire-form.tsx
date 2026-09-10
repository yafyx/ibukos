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
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import type { KosDetail } from "@/domain/kos/types";

export function InquireForm({ listing }: { listing: KosDetail }) {
	const [moveIn, setMoveIn] = useState<Date>();
	const [open, setOpen] = useState(false);
	const [pickingDate, setPickingDate] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const nama = String(data.get("nama") ?? "").trim();
		if (!nama) {
			return;
		}
		toast.success(`Pesan terkirim ke ${listing.ownerLabel}`);
		setOpen(false);
		setPickingDate(false);
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
				setOpen(next);
				if (!next) {
					setPickingDate(false);
				}
			}}
			open={open}
		>
			<PopoverTrigger render={<Button />}>Hubungi pemilik</PopoverTrigger>
			<PopoverPopup className="w-80">
				{pickingDate ? (
					<div className="flex flex-col gap-3">
						<Button
							onClick={() => setPickingDate(false)}
							size="sm"
							type="button"
							variant="ghost"
						>
							Kembali
						</Button>
						<Calendar
							mode="single"
							onSelect={(date) => {
								setMoveIn(date);
								setPickingDate(false);
							}}
							selected={moveIn}
						/>
					</div>
				) : (
					<Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
						<p className="font-heading font-medium text-sm">
							Hubungi {listing.ownerLabel}
						</p>
						<Field>
							<FieldLabel>Nama</FieldLabel>
							<Input name="nama" required />
						</Field>
						<Field>
							<FieldLabel>Nomor WhatsApp</FieldLabel>
							<Input inputMode="tel" name="telepon" required type="tel" />
						</Field>
						<Field>
							<FieldLabel>Tanggal masuk</FieldLabel>
							<Button
								className="w-full justify-start"
								onClick={() => setPickingDate(true)}
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
