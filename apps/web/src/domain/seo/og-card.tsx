import type { OgCardModel } from "./og-model";

const BRAND_GREEN = "#247a4a";
const TEXT_MUTED = "rgba(255,255,255,0.82)";

const SHELL = {
	backgroundColor: BRAND_GREEN,
	color: "#ffffff",
	fontFamily: "Figtree",
} as const;

function BrandMark({ logoSrc, kicker }: { logoSrc: string; kicker: string }) {
	return (
		<div tw="flex items-center" style={{ gap: 14 }}>
			<img
				alt=""
				height={52}
				src={logoSrc}
				style={{ borderRadius: 14, objectFit: "cover" }}
				tw="flex"
				width={52}
			/>
			<div style={{ fontWeight: 700, letterSpacing: -0.6 }} tw="text-4xl">
				{kicker}
			</div>
		</div>
	);
}

export function OgCard({
	card,
	logoSrc,
}: {
	card: OgCardModel;
	logoSrc: string;
}) {
	return (
		<div style={SHELL} tw="flex h-full w-full flex-row overflow-hidden">
			{card.photo ? (
				<div
					tw="flex h-full items-center justify-center"
					style={{ padding: 48, width: 460 }}
				>
					<div
						style={{
							borderRadius: 24,
							boxShadow: "0 24px 48px rgba(0,0,0,0.28)",
							height: 534,
							overflow: "hidden",
							width: 364,
						}}
						tw="flex"
					>
						<img
							alt=""
							height={534}
							src={card.photo}
							style={{ objectFit: "cover" }}
							tw="h-full w-full"
							width={364}
						/>
					</div>
				</div>
			) : null}

			<div
				tw="flex h-full flex-1 flex-col justify-between"
				style={{ padding: card.photo ? "56px 64px 56px 0" : 64 }}
			>
				<div tw="flex items-start justify-end">
					<BrandMark kicker={card.kicker} logoSrc={logoSrc} />
				</div>

				<div tw="flex flex-col" style={{ gap: 20 }}>
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
					<div
						style={{
							fontWeight: 700,
							letterSpacing: -1.6,
							lineHeight: 1.02,
						}}
						tw="text-7xl"
					>
						{card.title}
					</div>
					<div style={{ color: TEXT_MUTED }} tw="text-3xl">
						{card.subtitle}
					</div>
				</div>

				<div style={{ fontWeight: 700 }} tw="text-4xl">
					{card.price ?? "Sewa di Ibukos"}
				</div>
			</div>
		</div>
	);
}
