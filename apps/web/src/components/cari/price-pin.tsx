import L from "leaflet";
import {
	type Highlight,
	type HighlightEvent,
	highlightIsSelected,
} from "@/domain/cari/highlight";
import type { PlacedListing } from "@/domain/geo";
import { formatPinPriceIdr, genderChipClass } from "@/domain/kos/labels";

export function pinIcon(
	placed: PlacedListing,
	highlight: Highlight,
): L.DivIcon {
	const selected = highlightIsSelected(highlight, placed.listing.slug);
	const keyboard =
		selected && highlight.kind === "active" && highlight.input === "keyboard";
	const price = formatPinPriceIdr(
		placed.listing.pricePromo ?? placed.listing.priceMonthly,
	);
	return L.divIcon({
		className: "cari-price-pin-wrap",
		html: `<span class="cari-price-pin ${genderChipClass[placed.listing.gender]} ${selected ? "is-selected" : ""} ${keyboard ? "is-keyboard" : ""}">${price}</span>`,
		iconSize: [76, 28],
		iconAnchor: [38, 28],
	});
}

export function pinHighlightHandlers(
	slug: string,
	onHighlightEvent: (event: HighlightEvent) => void,
): L.LeafletEventHandlerFnMap {
	return {
		mouseover: () =>
			onHighlightEvent({
				type: "enter",
				slug,
				source: "pin",
				input: "pointer",
			}),
		mouseout: () => onHighlightEvent({ type: "leave", slug, source: "pin" }),
		click: () =>
			onHighlightEvent({
				type: "select",
				slug,
				source: "pin",
				input: "pointer",
			}),
	};
}
