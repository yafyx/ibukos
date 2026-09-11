"use client";

import { useState } from "react";

import { KosActionCard, KosFacts } from "@/components/kos/facts";
import { ListingCard } from "@/components/search/listing-card";
import { cityLabels } from "@/domain/kos/labels";
import type { KosDetail, KosListing } from "@/domain/kos/types";

export function KosDetailView({
	listing,
	similar,
}: {
	listing: KosDetail;
	similar: KosListing[];
}) {
	const [inquireOpen, setInquireOpen] = useState(false);
	const [pickingDate, setPickingDate] = useState(false);
	const [moveIn, setMoveIn] = useState<Date>();

	return (
		<>
			<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<KosFacts
					listing={listing}
					onAskAvailability={() => {
						setPickingDate(false);
						setInquireOpen(true);
					}}
					onPickCalendar={() => {
						setPickingDate(true);
						setInquireOpen(true);
					}}
					onSelectDate={setMoveIn}
					selectedDate={moveIn}
				/>
				<KosActionCard
					inquireOpen={inquireOpen}
					listing={listing}
					moveIn={moveIn}
					onInquireOpenChange={setInquireOpen}
					onMoveInChange={setMoveIn}
					onPickingDateChange={setPickingDate}
					pickingDate={pickingDate}
				/>
			</div>

			{similar.length > 0 ? (
				<section className="flex flex-col gap-4">
					<h2 className="flex h-8 items-center font-heading font-semibold text-lg tracking-tight">
						Kos serupa di {cityLabels[listing.city]}
					</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{similar.map((item) => (
							<ListingCard key={item.slug} listing={item} />
						))}
					</div>
				</section>
			) : null}
		</>
	);
}
