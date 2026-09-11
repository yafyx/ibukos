"use client";

import {
	Bathtub01Icon,
	BedSingle01Icon,
	Calendar03Icon,
	Car01Icon,
	Door01Icon,
	ElectricPlugsIcon,
	Flag01Icon,
	KitchenUtensilsIcon,
	Scooter01Icon,
	Share03Icon,
	SmartPhone01Icon,
	SnowflakeIcon,
	StarIcon,
	Toilet01Icon,
	Wifi01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import {
	Collapsible,
	CollapsiblePanel,
	CollapsibleTrigger,
} from "@ibukos/ui/components/collapsible";
import { cn } from "@ibukos/ui/lib/utils";
import { ZapIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { InquireForm } from "@/components/kos/inquire-form";
import { LocationMap } from "@/components/kos/location-map";
import { PhotoCarousel } from "@/components/kos/photo-carousel";
import { SectionHeading } from "@/components/kos/section-heading";
import { SaveKosChip } from "@/components/save-kos-chip";
import {
	durationMonthlyPrice,
	listingGreatFor,
	listingLoveItems,
	listingOverview,
	ownerPhoneFor,
	ownerWhatsAppHref,
	sameDay,
	splitOverview,
	upcomingDays,
} from "@/domain/kos/detail-content";
import {
	badgeLabels,
	durationLabels,
	facilityLabels,
	formatDiscountShortIdr,
	formatPriceIdr,
	genderChipClass,
	genderLabels,
	genderPriceClass,
	ruleLabels,
} from "@/domain/kos/labels";
import type { FacilityId, KosDetail } from "@/domain/kos/types";
import { pressable } from "@/lib/motion";

const highlightTile =
	"flex h-20 min-w-20 flex-col items-center justify-center gap-1 rounded-xl bg-muted/80 px-3";
const mutedCard = "rounded-2xl bg-muted/80 p-4";

const facilityIcons: Record<FacilityId, typeof Wifi01Icon> = {
	ac: SnowflakeIcon,
	dapur: KitchenUtensilsIcon,
	kasur: BedSingle01Icon,
	"kloset-duduk": Toilet01Icon,
	"km-dalam": Bathtub01Icon,
	listrik: ElectricPlugsIcon,
	"parkir-mobil": Car01Icon,
	"parkir-motor": Scooter01Icon,
	wifi: Wifi01Icon,
};

export function KosFacts({
	listing,
	selectedDate,
	onSelectDate,
	onAskAvailability,
	onPickCalendar,
}: {
	listing: KosDetail;
	selectedDate: Date | undefined;
	onSelectDate: (date: Date) => void;
	onAskAvailability: () => void;
	onPickCalendar: () => void;
}) {
	const displayPrice = listing.pricePromo ?? listing.priceMonthly;
	const roomsLow = listing.roomsAvailable > 0 && listing.roomsAvailable <= 3;
	const available = listing.roomsAvailable > 0;
	const loveItems = listingLoveItems(listing);
	const greatFor = listingGreatFor(listing);

	return (
		<div className="detail-stack flex min-w-0 flex-col gap-6">
			<PhotoCarousel alt={listing.name} photos={listing.photos} />

			<header className="flex flex-col gap-2">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
					<div className="flex min-w-0 items-center gap-2 overflow-visible">
						<h1 className="min-w-0 text-balance font-heading font-semibold text-2xl leading-8 tracking-tight">
							{listing.name}
						</h1>
						<SaveKosChip name={listing.name} slug={listing.slug} />
					</div>
					<div className="flex flex-wrap items-center gap-2 sm:justify-end">
						<Badge
							className={genderChipClass[listing.gender]}
							variant="outline"
						>
							{genderLabels[listing.gender]}
						</Badge>
						{available ? (
							<Badge variant={roomsLow ? "warning" : "success"}>
								Sisa {listing.roomsAvailable} kamar
							</Badge>
						) : (
							<Badge variant="error">Penuh</Badge>
						)}
						{listing.badges.map((badge) => (
							<Badge key={badge} variant="info">
								{badgeLabels[badge]}
							</Badge>
						))}
					</div>
				</div>
				<p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
					<span
						className={cn(
							"font-semibold text-xl tabular-nums leading-8 sm:text-2xl",
							genderPriceClass[listing.gender],
						)}
					>
						{formatPriceIdr(displayPrice)}
					</span>
					<span className="text-muted-foreground">
						{listing.pricePromo ? "bulan pertama" : "/bulan"}
					</span>
					<span aria-hidden="true" className="text-muted-foreground/50">
						·
					</span>
					<a
						className="text-muted-foreground underline decoration-foreground/20 underline-offset-2 transition-colors duration-[160ms] ease-[var(--ease-out)] hover:text-foreground hover:decoration-foreground/45"
						href="#lokasi"
					>
						{listing.address}
					</a>
				</p>
				{listing.pricePromo ? (
					<p className="flex flex-wrap items-center gap-x-2 text-xs">
						<span className="inline-flex items-center gap-1 font-semibold text-destructive">
							<ZapIcon aria-hidden="true" className="size-3 fill-current" />
							Diskon{" "}
							{formatDiscountShortIdr(listing.priceMonthly, listing.pricePromo)}
						</span>
						<span className="text-muted-foreground tabular-nums line-through">
							{formatPriceIdr(listing.priceMonthly)}
						</span>
					</p>
				) : null}
			</header>

			<section className="flex flex-col gap-2">
				<SectionHeading>Sorotan</SectionHeading>
				<div className="flex flex-wrap gap-2">
					<div className="flex h-20 min-w-fit overflow-hidden rounded-xl bg-muted/80">
						<FactCell
							icon={Door01Icon}
							label={available ? `${listing.roomsAvailable} kamar` : "Penuh"}
							tone={available ? (roomsLow ? "warning" : "default") : "danger"}
						/>
						<div
							aria-hidden="true"
							className="my-2 w-px self-stretch bg-border/80"
						/>
						<FactCell
							icon={StarIcon}
							label={
								listing.rating !== undefined
									? listing.rating.toFixed(1)
									: "Baru"
							}
							tone={listing.rating !== undefined ? "rating" : "default"}
						/>
					</div>
					{listing.facilities.map((facility) => (
						<div className={highlightTile} key={facility}>
							<HugeiconsIcon
								aria-hidden="true"
								className="size-5 text-muted-foreground"
								icon={facilityIcons[facility]}
								strokeWidth={1.5}
							/>
							<p className="max-w-24 text-pretty text-center font-medium text-xs leading-4">
								{facilityLabels[facility]}
							</p>
						</div>
					))}
				</div>
			</section>

			<div className="grid items-stretch gap-4 sm:grid-cols-2">
				<MoveInCard
					available={available}
					onPickCalendar={onPickCalendar}
					onSelectDate={onSelectDate}
					selectedDate={selectedDate}
				/>
				<LocationMap listing={listing} />
			</div>

			<Overview listing={listing} />

			{loveItems.length > 0 || greatFor.length > 0 ? (
				<div className="grid items-start gap-4 sm:grid-cols-2">
					{loveItems.length > 0 ? (
						<section className="flex flex-col gap-2">
							<SectionHeading>Yang bakal kamu suka</SectionHeading>
							<div className="flex flex-wrap gap-2">
								{loveItems.map((item) => (
									<Badge key={item} variant="outline">
										{item}
									</Badge>
								))}
							</div>
						</section>
					) : null}
					{greatFor.length > 0 ? (
						<section className="flex flex-col gap-2">
							<SectionHeading>Cocok untuk</SectionHeading>
							<div className="flex flex-wrap gap-2">
								{greatFor.map((item) => (
									<Badge key={item} variant="secondary">
										{item}
									</Badge>
								))}
							</div>
						</section>
					) : null}
				</div>
			) : null}

			<section className="flex flex-col gap-2">
				<SectionHeading>Pilihan sewa</SectionHeading>
				<div className="flex flex-col gap-2">
					{listing.durations.map((duration) => {
						const price = durationMonthlyPrice(listing, duration);
						return (
							<div
								className="flex h-14 items-center justify-between gap-2 rounded-xl bg-muted/80 px-4"
								key={duration}
							>
								<div className="min-w-0">
									<p className="font-medium text-sm leading-4">
										{durationLabels[duration]}
									</p>
									<p
										className={cn(
											"font-semibold text-sm tabular-nums leading-5",
											genderPriceClass[listing.gender],
										)}
									>
										{formatPriceIdr(price)}
										<span className="font-normal text-muted-foreground">
											{duration === "mingguan" ? "/minggu" : "/bulan"}
										</span>
									</p>
								</div>
								<Button
									onClick={onAskAvailability}
									type="button"
									variant="outline"
								>
									Tanya
								</Button>
							</div>
						);
					})}
				</div>
			</section>

			{listing.rules.length > 0 ? (
				<section className="flex flex-col gap-2">
					<SectionHeading>Aturan</SectionHeading>
					<div className="flex flex-wrap gap-2">
						{listing.rules.map((rule) => (
							<Badge key={rule} variant="outline">
								{ruleLabels[rule]}
							</Badge>
						))}
					</div>
				</section>
			) : null}

			<div className="flex flex-wrap gap-2 lg:hidden">
				<ShareActions />
			</div>
		</div>
	);
}

function FactCell({
	icon,
	label,
	tone = "default",
}: {
	icon: typeof Door01Icon;
	label: string;
	tone?: "default" | "warning" | "danger" | "rating";
}) {
	return (
		<div className="flex h-full min-w-20 flex-col items-center justify-center gap-1 px-3">
			<HugeiconsIcon
				aria-hidden="true"
				className={cn(
					"size-5",
					tone === "rating" ? "text-success" : "text-muted-foreground",
				)}
				icon={icon}
				strokeWidth={1.5}
			/>
			<p
				className={cn(
					"text-center font-medium text-xs tabular-nums leading-4",
					tone === "danger" && "text-destructive",
					tone === "warning" && "text-warning-foreground",
					tone === "rating" && "text-foreground",
				)}
			>
				{label}
			</p>
		</div>
	);
}

function Overview({ listing }: { listing: KosDetail }) {
	const { rest, teaser } = splitOverview(listingOverview(listing));
	const [open, setOpen] = useState(false);

	return (
		<section className="flex flex-col gap-2">
			<SectionHeading>Deskripsi</SectionHeading>
			<div className={cn("max-w-prose", mutedCard)}>
				<p className="text-pretty text-muted-foreground text-sm leading-relaxed">
					{teaser}
				</p>
				{rest ? (
					<Collapsible onOpenChange={setOpen} open={open}>
						<CollapsiblePanel>
							<p className="mt-2 text-pretty text-muted-foreground text-sm leading-relaxed">
								{rest}
							</p>
						</CollapsiblePanel>
						<CollapsibleTrigger
							className="mt-2 font-medium text-foreground text-sm underline decoration-foreground/20 underline-offset-2"
							type="button"
						>
							{open ? "Lebih sedikit" : "Selengkapnya"}
						</CollapsibleTrigger>
					</Collapsible>
				) : null}
			</div>
		</section>
	);
}

function MoveInCard({
	available,
	onPickCalendar,
	onSelectDate,
	selectedDate,
}: {
	available: boolean;
	onPickCalendar: () => void;
	onSelectDate: (date: Date) => void;
	selectedDate: Date | undefined;
}) {
	const days = upcomingDays(4);
	const shown = selectedDate ?? days[0];
	const month = new Intl.DateTimeFormat("id-ID", { month: "short" })
		.format(shown)
		.replace(".", "")
		.toUpperCase();
	const day = shown.getDate();

	return (
		<section className="flex h-full min-h-0 flex-col gap-2">
			<SectionHeading
				action={
					<Button
						className="h-8"
						onClick={onPickCalendar}
						type="button"
						variant="ghost"
					>
						Semua tanggal
					</Button>
				}
			>
				Survei
			</SectionHeading>
			<div className={cn("flex min-h-64 flex-1 flex-col", mutedCard)}>
				<HugeiconsIcon
					aria-hidden="true"
					className="size-5 text-muted-foreground"
					icon={Calendar03Icon}
					strokeWidth={1.5}
				/>
				<p
					aria-hidden="true"
					className={cn(
						"mt-2 font-heading font-semibold text-5xl leading-none tracking-tight sm:text-6xl",
						available ? "text-muted-foreground/35" : "text-destructive/25",
					)}
				>
					<span className="block text-[0.7em] tracking-[0.18em]">{month}</span>
					<span className="tabular-nums">{day}</span>
				</p>
				<div className="mt-4 flex gap-2">
					{days.map((date) => {
						const selected = sameDay(date, shown);
						const weekday = new Intl.DateTimeFormat("id-ID", {
							weekday: "short",
						})
							.format(date)
							.replace(".", "");
						return (
							<button
								aria-pressed={selected}
								className={cn(
									"flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-1 py-2 text-center transition-[background-color,color,transform] duration-[160ms] ease-[var(--ease-out)]",
									"active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
									"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
									selected
										? "bg-primary text-primary-foreground"
										: "bg-background/80 text-foreground",
								)}
								key={date.toISOString()}
								onClick={() => onSelectDate(date)}
								type="button"
							>
								<span className="text-xs uppercase tracking-wide">
									{weekday}
								</span>
								<span className="font-heading font-semibold text-sm tabular-nums">
									{date.getDate()}
								</span>
							</button>
						);
					})}
				</div>
				<p className="mt-auto pt-4 font-medium text-sm">
					{available ? "Bisa langsung masuk" : "Penuh — tanya ketersediaan"}
				</p>
			</div>
		</section>
	);
}

export function ShareActions() {
	return (
		<>
			<Button
				onClick={async () => {
					await navigator.clipboard.writeText(window.location.href);
					toast.success("Tautan kos disalin");
				}}
				variant="outline"
			>
				<HugeiconsIcon
					aria-hidden="true"
					className="size-3.5"
					icon={Share03Icon}
				/>
				Salin tautan
			</Button>
			<AlertDialog>
				<AlertDialogTrigger render={<Button variant="ghost" />}>
					<HugeiconsIcon
						aria-hidden="true"
						className="size-3.5"
						icon={Flag01Icon}
					/>
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
							onClick={() => toast.success("Laporan diterima")}
							render={<Button variant="destructive" />}
						>
							Kirim laporan
						</AlertDialogClose>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export function KosActionCard({
	listing,
	inquireOpen,
	onInquireOpenChange,
	pickingDate,
	onPickingDateChange,
	moveIn,
	onMoveInChange,
}: {
	listing: KosDetail;
	inquireOpen: boolean;
	onInquireOpenChange: (open: boolean) => void;
	pickingDate: boolean;
	onPickingDateChange: (picking: boolean) => void;
	moveIn: Date | undefined;
	onMoveInChange: (date: Date | undefined) => void;
}) {
	const ownerInitials = listing.ownerLabel
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
	const displayPrice = listing.pricePromo ?? listing.priceMonthly;
	const available = listing.roomsAvailable > 0;
	const roomsLow = listing.roomsAvailable > 0 && listing.roomsAvailable <= 3;
	const moveInLabel = moveIn
		? new Intl.DateTimeFormat("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
			}).format(moveIn)
		: null;
	const whatsAppLabel = `Chat WhatsApp ${listing.ownerLabel}`;

	return (
		<aside className="pointer-events-none fixed inset-x-0 bottom-0 z-30 lg:pointer-events-auto lg:sticky lg:top-[calc(var(--site-header-height)+1rem)] lg:self-start">
			<div
				className={cn(
					"pointer-events-auto flex flex-col gap-3 bg-background/95 ps-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-16px_oklch(0_0_0/0.18)] backdrop-blur-sm",
					"lg:gap-4 lg:rounded-2xl lg:border lg:bg-muted/80 lg:p-4 lg:shadow-none lg:backdrop-blur-none",
				)}
			>
				<div className="flex items-center justify-between gap-2 lg:hidden">
					<Badge className={genderChipClass[listing.gender]} variant="outline">
						{genderLabels[listing.gender]}
					</Badge>
					{available ? (
						<span
							className={cn(
								"text-xs",
								roomsLow
									? "font-medium text-warning-foreground"
									: "text-muted-foreground",
							)}
						>
							Sisa {listing.roomsAvailable} kamar
						</span>
					) : (
						<span className="font-medium text-destructive text-xs">Penuh</span>
					)}
				</div>

				<div className="hidden flex-col gap-3 lg:flex">
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							className={genderChipClass[listing.gender]}
							variant="outline"
						>
							{genderLabels[listing.gender]}
						</Badge>
						{available ? (
							<Badge variant={roomsLow ? "warning" : "success"}>
								Sisa {listing.roomsAvailable} kamar
							</Badge>
						) : (
							<Badge variant="error">Penuh</Badge>
						)}
					</div>
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarFallback>{ownerInitials}</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<p className="font-medium text-sm">{listing.ownerLabel}</p>
							<p className="truncate text-muted-foreground text-xs">
								{listing.area}
								{listing.campus ? ` · dekat ${listing.campus}` : ""}
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 pb-[max(0px,env(safe-area-inset-bottom))] lg:pb-0">
					<div className="min-w-0">
						<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
							<p
								className={cn(
									"font-semibold text-lg tabular-nums lg:text-2xl",
									genderPriceClass[listing.gender],
								)}
							>
								{formatPriceIdr(displayPrice)}
							</p>
							<span className="text-muted-foreground text-sm">
								{listing.pricePromo ? "bulan pertama" : "/bulan"}
							</span>
						</div>
						{listing.pricePromo ? (
							<p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
								<span className="inline-flex items-center gap-1 font-semibold text-destructive">
									<ZapIcon aria-hidden="true" className="size-3 fill-current" />
									Diskon{" "}
									{formatDiscountShortIdr(
										listing.priceMonthly,
										listing.pricePromo,
									)}
								</span>
								<span className="text-muted-foreground tabular-nums line-through">
									{formatPriceIdr(listing.priceMonthly)}
								</span>
							</p>
						) : null}
						{moveInLabel ? (
							<p className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
								<HugeiconsIcon
									aria-hidden="true"
									className="size-3.5 shrink-0"
									icon={Calendar03Icon}
								/>
								Rencana masuk {moveInLabel}
							</p>
						) : null}
						<p className="mt-1 hidden text-muted-foreground text-sm lg:block">
							{available
								? "Bisa langsung masuk"
								: "Penuh — tanya antrean kamar"}
						</p>
					</div>

					<div className="flex items-stretch gap-2 lg:flex-col lg:gap-3">
						<a
							aria-label={whatsAppLabel}
							className={cn(
								"inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background lg:hidden",
								pressable,
							)}
							href={ownerWhatsAppHref(listing)}
							rel="noreferrer"
							target="_blank"
						>
							<HugeiconsIcon
								aria-hidden="true"
								className="size-5"
								icon={SmartPhone01Icon}
							/>
						</a>
						<InquireForm
							className="min-w-0 flex-1 lg:w-full lg:flex-none"
							listing={listing}
							moveIn={moveIn}
							onMoveInChange={onMoveInChange}
							onOpenChange={onInquireOpenChange}
							onPickingDateChange={onPickingDateChange}
							open={inquireOpen}
							pickingDate={pickingDate}
						/>
						<a
							className={cn(
								"hidden h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background font-medium text-sm lg:inline-flex",
								pressable,
							)}
							href={ownerWhatsAppHref(listing)}
							rel="noreferrer"
							target="_blank"
						>
							<HugeiconsIcon
								aria-hidden="true"
								className="size-4"
								icon={SmartPhone01Icon}
							/>
							Chat WhatsApp
							<span className="text-muted-foreground tabular-nums">
								{ownerPhoneFor(listing.slug)}
							</span>
						</a>
					</div>
				</div>

				<div className="hidden flex-wrap gap-2 border-border/60 border-t pt-3 lg:flex">
					<ShareActions />
				</div>
			</div>
		</aside>
	);
}
