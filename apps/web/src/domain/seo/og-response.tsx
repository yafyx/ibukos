import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";

import { OgCard } from "./og-card";
import type { OgCardModel } from "./og-model";
import { absoluteUrl, siteOrigin } from "./site";

const OG_SIZE = { width: 1200, height: 630 } as const;

let fontsPromise: ReturnType<typeof googleFonts> | undefined;

function ogFonts() {
	fontsPromise ??= googleFonts([
		{ name: "Figtree", weight: "300..900" },
	]);
	return fontsPromise;
}

export async function ogImageResponse(
	card: OgCardModel,
	requestUrl?: string,
): Promise<Response> {
	const fonts = await ogFonts();
	const logoSrc = absoluteUrl(
		"/brand/ibukos-ibu.png",
		siteOrigin(requestUrl),
	);
	const response = new ImageResponse(
		<OgCard card={card} logoSrc={logoSrc} />,
		{
			...OG_SIZE,
			fonts,
			format: "png",
			headers: {
				"Cache-Control": "public, max-age=3600",
			},
		},
	);
	try {
		await response.ready;
		return response;
	} catch {
		return new Response("OG image failed", { status: 500 });
	}
}
