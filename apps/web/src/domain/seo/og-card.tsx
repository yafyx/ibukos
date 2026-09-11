import type { OgCardModel } from "./og-model";

const SHELL = {
	backgroundColor: "#f3f6f3",
	color: "#142018",
	fontFamily: "Figtree",
} as const;

export function OgCard({ card }: { card: OgCardModel }) {
	return (
		<div style={SHELL} tw="flex h-full w-full flex-row overflow-hidden">
			<div tw="flex h-full flex-1 flex-col justify-between p-16">
				<div tw="flex items-center justify-between">
					<div tw="flex items-center" style={{ gap: 14 }}>
						<div
							style={{ backgroundColor: "#247a4a" }}
							tw="flex h-12 w-12 items-center justify-center rounded-xl"
						>
							<div
								style={{
									backgroundColor: "#f3f6f3",
									borderRadius: 999,
									height: 18,
									width: 18,
								}}
							/>
						</div>
						<div style={{ fontWeight: 700, letterSpacing: -0.6 }} tw="text-3xl">
							{card.kicker}
						</div>
					</div>
					{card.badge ? (
						<div
							style={{
								backgroundColor: card.badge.color,
								color: "#fff",
								fontWeight: 600,
							}}
							tw="flex rounded-full px-5 py-2 text-2xl"
						>
							{card.badge.label}
						</div>
					) : null}
				</div>

				<div tw="flex flex-col" style={{ gap: 18 }}>
					<div
						style={{
							fontWeight: 700,
							letterSpacing: -1.4,
							lineHeight: 1.05,
						}}
						tw="text-7xl"
					>
						{card.title}
					</div>
					<div style={{ color: "#4b5c52" }} tw="text-3xl">
						{card.subtitle}
					</div>
				</div>

				<div style={{ color: "#247a4a", fontWeight: 700 }} tw="text-4xl">
					{card.price ?? "Sewa di Ibukos"}
				</div>
			</div>

			{card.photo ? (
				<div tw="flex h-full w-[420px]">
					<img
						alt=""
						height={630}
						src={card.photo}
						style={{ objectFit: "cover" }}
						tw="h-full w-full"
						width={420}
					/>
				</div>
			) : (
				<div
					style={{
						backgroundColor: "#247a4a",
						width: 28,
					}}
					tw="h-full"
				/>
			)}
		</div>
	);
}
