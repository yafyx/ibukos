import { cn } from "@ibukos/ui/lib/utils";
import { genderChipClass, genderLabels } from "@/domain/kos/labels";
import type { Gender } from "@/domain/kos/types";

const legendItems: {
	gender: Gender;
	sample: string;
	description: string;
}[] = [
	{
		gender: "campur",
		sample: "Rp750rb",
		description: "Harga berwarna ungu menandakan sebuah kos campur.",
	},
	{
		gender: "putra",
		sample: "Rp1,85jt",
		description: "Harga berwarna biru menandakan sebuah kos putra.",
	},
	{
		gender: "putri",
		sample: "Rp2,455jt",
		description: "Harga berwarna merah muda menandakan ada sebuah kos putri.",
	},
];

export function PriceLegend({
	total,
	variant = "sidebar",
}: {
	total: number;
	variant?: "sidebar" | "overlay";
}) {
	if (variant === "overlay") {
		return (
			<aside
				aria-label="Keterangan warna harga kos"
				className="rounded-lg border bg-card/95 px-2 py-1.5 text-xs shadow-sm backdrop-blur-sm"
			>
				<ul className="flex flex-wrap items-center gap-1.5">
					<li className="inline-flex items-center gap-1.5">
						<span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border bg-background font-medium tabular-nums">
							{total}
						</span>
						<span className="sr-only">Jumlah kos</span>
					</li>
					{legendItems.map((item) => (
						<li key={item.gender}>
							<span
								className={cn(
									"inline-flex shrink-0 rounded-full px-2 py-0.5 tabular-nums",
									genderChipClass[item.gender],
								)}
							>
								{item.sample}
							</span>
							<span className="sr-only">
								{genderLabels[item.gender]}: {item.description}
							</span>
						</li>
					))}
				</ul>
			</aside>
		);
	}

	return (
		<aside
			aria-label="Keterangan warna harga kos"
			className="rounded-xl border bg-card p-4 text-sm shadow-sm"
		>
			<ul className="flex flex-col gap-3">
				<li className="flex items-start gap-3">
					<span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border bg-background font-medium text-xs tabular-nums">
						{total}
					</span>
					<p className="text-pretty leading-snug">
						<span className="font-medium">Jumlah kos:</span> Total dari kos yang
						ada di area sekitar titik yang dipilih.
					</p>
				</li>
				{legendItems.map((item) => (
					<li className="flex items-start gap-3" key={item.gender}>
						<span
							className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs tabular-nums ${genderChipClass[item.gender]}`}
						>
							{item.sample}
						</span>
						<p className="text-pretty leading-snug">
							<span className="font-medium">{genderLabels[item.gender]}:</span>{" "}
							{item.description}
						</p>
					</li>
				))}
			</ul>
		</aside>
	);
}
