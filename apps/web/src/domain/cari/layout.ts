import type { CariView } from "../geo";

export type CariLayout = CariView;
export type ViewportBand = "narrow" | "wide";

export function realizeCariLayout(
	view: CariView,
	band: ViewportBand,
): CariLayout {
	if (band === "narrow" && view === "split") {
		return "daftar";
	}
	return view;
}
