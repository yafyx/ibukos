import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { LocationLanding } from "@/components/seo/location-landing";
import { GENDERS } from "@/domain/facets/definitions";
import { cityLabels, genderLabels } from "@/domain/kos/labels";
import { seoHead } from "@/domain/seo/head";
import {
	cityIntro,
	cityListings,
	genderCityListings,
	parseCitySlug,
} from "@/domain/seo/locations";
import { cityDocument } from "@/domain/seo/pages";

export const Route = createFileRoute("/kota/$city")({
	loader: ({ params }) => {
		const city = parseCitySlug(params.city);
		if (!city) {
			throw notFound();
		}
		const listings = cityListings(city);
		if (listings.length === 0) {
			throw notFound();
		}
		return { city, listings };
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {};
		}
		const document = cityDocument(loaderData.city);
		return document ? seoHead(document) : {};
	},
	component: CityLandingPage,
});

function CityLandingPage() {
	const { city, listings } = Route.useLoaderData();
	const label = cityLabels[city];

	return (
		<LocationLanding
			crumbs={[{ label, to: "/kota/$city", params: { city } }]}
			filterQuery={{ city }}
			h1={`Kos di ${label}`}
			intro={cityIntro(city, listings)}
			listings={listings}
		>
			<nav aria-label="Tipe kos" className="flex flex-wrap gap-2">
				{GENDERS.filter(
					(gender) => genderCityListings(city, gender).length > 0,
				).map((gender) => (
					<Link
						className="rounded-full border bg-background px-3 py-1.5 font-medium text-sm"
						key={gender}
						params={{ city, gender }}
						to="/kota/$city/$gender"
					>
						Kos {genderLabels[gender]}
					</Link>
				))}
			</nav>
		</LocationLanding>
	);
}
