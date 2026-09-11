import { createFileRoute, notFound } from "@tanstack/react-router";

import { LocationLanding } from "@/components/seo/location-landing";
import { cityLabels, genderLabels } from "@/domain/kos/labels";
import { seoHead } from "@/domain/seo/head";
import {
	genderCityIntro,
	genderCityListings,
	parseCitySlug,
	parseGender,
} from "@/domain/seo/locations";
import { genderCityDocument } from "@/domain/seo/pages";

export const Route = createFileRoute("/kota/$city/$gender")({
	loader: ({ params }) => {
		const city = parseCitySlug(params.city);
		const gender = parseGender(params.gender);
		if (!city || !gender) {
			throw notFound();
		}
		const listings = genderCityListings(city, gender);
		if (listings.length === 0) {
			throw notFound();
		}
		return { city, gender, listings };
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {};
		}
		const document = genderCityDocument(loaderData.city, loaderData.gender);
		return document ? seoHead(document) : {};
	},
	component: GenderCityLandingPage,
});

function GenderCityLandingPage() {
	const { city, gender, listings } = Route.useLoaderData();
	const cityLabel = cityLabels[city];
	const genderLabel = genderLabels[gender];

	return (
		<LocationLanding
			crumbs={[
				{ label: cityLabel, params: { city }, to: "/kota/$city" },
				{
					label: genderLabel,
					params: { city, gender },
					to: "/kota/$city/$gender",
				},
			]}
			filterQuery={{ city, gender }}
			h1={`Kos ${genderLabel} di ${cityLabel}`}
			intro={genderCityIntro(city, gender, listings)}
			listings={listings}
		/>
	);
}
