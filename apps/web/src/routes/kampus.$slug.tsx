import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import {
	type LocationCrumb,
	LocationLanding,
} from "@/components/seo/location-landing";
import { seoHead } from "@/domain/seo/head";
import { campusBySlug, campusIntro } from "@/domain/seo/locations";
import { campusDocument } from "@/domain/seo/pages";

export const Route = createFileRoute("/kampus/$slug")({
	loader: ({ params }) => {
		const campus = campusBySlug(params.slug);
		if (!campus || campus.listings.length === 0) {
			throw notFound();
		}
		return { campus };
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {};
		}
		const document = campusDocument(loaderData.campus.slug);
		return document ? seoHead(document) : {};
	},
	component: CampusLandingPage,
});

function CampusLandingPage() {
	const { campus } = Route.useLoaderData();
	const crumbs: LocationCrumb[] = campus.city
		? [
				{
					label: campus.cityLabel,
					params: { city: campus.city },
					to: "/kota/$city",
				},
				{
					label: campus.label,
					params: { slug: campus.slug },
					to: "/kampus/$slug",
				},
			]
		: [
				{
					label: campus.label,
					params: { slug: campus.slug },
					to: "/kampus/$slug",
				},
			];

	return (
		<LocationLanding
			crumbs={crumbs}
			filterQuery={{ q: campus.label, city: campus.city }}
			h1={`Kos dekat ${campus.label}`}
			intro={campusIntro(campus)}
			listings={campus.listings}
		>
			{campus.city ? (
				<p className="text-muted-foreground text-sm">
					Lihat juga{" "}
					<Link
						className="font-medium text-foreground underline-offset-4 hover:underline"
						params={{ city: campus.city }}
						to="/kota/$city"
					>
						semua kos di {campus.cityLabel}
					</Link>
					.
				</p>
			) : null}
		</LocationLanding>
	);
}
