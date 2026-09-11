import { createFileRoute, notFound } from "@tanstack/react-router";

import { LocationLanding } from "@/components/seo/location-landing";
import { genderLabels } from "@/domain/kos/labels";
import { seoHead } from "@/domain/seo/head";
import { parseGender, tipeIntro, tipeListings } from "@/domain/seo/locations";
import { tipeDocument } from "@/domain/seo/pages";

export const Route = createFileRoute("/tipe/$gender")({
	loader: ({ params }) => {
		const gender = parseGender(params.gender);
		if (!gender) {
			throw notFound();
		}
		const listings = tipeListings(gender);
		if (listings.length === 0) {
			throw notFound();
		}
		return { gender, listings };
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {};
		}
		return seoHead(tipeDocument(loaderData.gender));
	},
	component: TipeLandingPage,
});

function TipeLandingPage() {
	const { gender, listings } = Route.useLoaderData();
	const genderLabel = genderLabels[gender];

	return (
		<LocationLanding
			crumbs={[
				{
					label: genderLabel,
					params: { gender },
					to: "/tipe/$gender",
				},
			]}
			filterQuery={{ gender }}
			h1={`Kos ${genderLabel}`}
			intro={tipeIntro(gender, listings)}
			listings={listings}
		/>
	);
}
