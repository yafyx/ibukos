"use client";

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@ibukos/ui/components/alert-dialog";
import { Avatar, AvatarFallback } from "@ibukos/ui/components/avatar";
import { Badge } from "@ibukos/ui/components/badge";
import { Button } from "@ibukos/ui/components/button";
import { Separator } from "@ibukos/ui/components/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@ibukos/ui/components/tooltip";
import { toast } from "sonner";

import { InquireForm } from "@/components/kos/inquire-form";
import {
	badgeLabels,
	cityLabels,
	facilityLabels,
	formatPriceIdr,
	genderLabels,
	ruleLabels,
} from "@/domain/kos/labels";
import type { KosDetail } from "@/domain/kos/types";

export function KosFacts({ listing }: { listing: KosDetail }) {
	const ownerInitials = listing.ownerLabel
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap gap-2">
				<Badge variant="secondary">{genderLabels[listing.gender]}</Badge>
				{listing.roomsAvailable > 0 ? (
					<Badge variant="success">Sisa {listing.roomsAvailable} kamar</Badge>
				) : (
					<Badge variant="error">Penuh</Badge>
				)}
				{listing.badges.map((badge) => (
					<Badge key={badge} variant="info">
						{badgeLabels[badge]}
					</Badge>
				))}
			</div>

			<div>
				<h1 className="font-heading font-semibold text-2xl tracking-tight">
					{listing.name}
				</h1>
				<p className="text-muted-foreground">
					{listing.area}, {cityLabels[listing.city]}
				</p>
				<p className="text-muted-foreground text-sm">{listing.address}</p>
			</div>

			<div className="flex items-baseline gap-2">
				{listing.pricePromo ? (
					<>
						<span className="font-semibold text-2xl text-primary">
							{formatPriceIdr(listing.pricePromo)}/bulan
						</span>
						<span className="text-muted-foreground line-through">
							{formatPriceIdr(listing.priceMonthly)}
						</span>
					</>
				) : (
					<span className="font-semibold text-2xl text-primary">
						{formatPriceIdr(listing.priceMonthly)}/bulan
					</span>
				)}
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarFallback>{ownerInitials}</AvatarFallback>
					</Avatar>
					<p className="text-sm">{listing.ownerLabel}</p>
				</div>
				<InquireForm listing={listing} />
				<Button
					onClick={async () => {
						await navigator.clipboard.writeText(window.location.href);
						toast.success("Tautan kos disalin");
					}}
					variant="outline"
				>
					Salin tautan
				</Button>
				<AlertDialog>
					<AlertDialogTrigger render={<Button variant="ghost" />}>
						Laporkan
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Laporkan kos ini?</AlertDialogTitle>
							<AlertDialogDescription>
								Laporan membantu kami meninjau listing yang mencurigakan. Tidak
								ada data yang dikirim ke pemilik.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogClose render={<Button variant="ghost" />}>
								Batal
							</AlertDialogClose>
							<AlertDialogClose
								render={<Button variant="destructive" />}
								onClick={() => toast.success("Laporan diterima")}
							>
								Kirim laporan
							</AlertDialogClose>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<Separator />

			<div className="flex flex-col gap-2">
				<h2 className="font-heading font-medium">Fasilitas</h2>
				<div className="flex flex-wrap gap-2">
					{listing.facilities.map((facility) => (
						<Tooltip key={facility}>
							<TooltipTrigger render={<Badge variant="outline" />}>
								{facilityLabels[facility]}
							</TooltipTrigger>
							<TooltipContent>
								{facilityLabels[facility]} sudah termasuk sewa
							</TooltipContent>
						</Tooltip>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<h2 className="font-heading font-medium">Aturan</h2>
				<div className="flex flex-wrap gap-2">
					{listing.rules.map((rule) => (
						<Badge key={rule} variant="outline">
							{ruleLabels[rule]}
						</Badge>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<h2 className="font-heading font-medium">Deskripsi</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">
					{listing.description}
				</p>
			</div>
		</div>
	);
}
