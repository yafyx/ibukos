import { Toaster } from "@ibukos/ui/components/sonner";
import { TooltipProvider } from "@ibukos/ui/components/tooltip";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import { chromeFromMatches } from "../components/chrome/page-chrome";
import { SiteFooter } from "../components/chrome/site-footer";
import { SiteHeader } from "../components/chrome/site-header";
import { ThemeProvider } from "../components/chrome/theme-provider";
import { SearchDockProvider } from "../components/search/search-dock";
import { jsonLdScript, organizationJsonLd } from "../domain/seo/schema";
import { SITE_DESCRIPTION, SITE_NAME, siteOrigin } from "../domain/seo/site";

import appCss from "../index.css?url";

export type RouterAppContext = Record<string, never>;

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{
				title: SITE_NAME,
			},
			{
				name: "description",
				content: SITE_DESCRIPTION,
			},
			{
				name: "theme-color",
				content: "#247a4a",
			},
			{
				name: "color-scheme",
				content: "light dark",
			},
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/brand/ibukos-ibu.png",
			},
			{
				rel: "apple-touch-icon",
				href: "/brand/ibukos-ibu.png",
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest",
			},
		],
		scripts: [jsonLdScript(organizationJsonLd(siteOrigin()))],
	}),

	component: RootDocument,
});

function RootDocument() {
	useEffect(() => {
		if (import.meta.env.DEV) {
			void import("react-grab");
		}
	}, []);

	const chrome = useRouterState({
		select: (state) => chromeFromMatches(state.matches),
	});
	const viewport = chrome.kind === "viewport";

	return (
		<html lang="id" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="relative">
				<a className="skip-link" href="#main">
					Lewati ke konten
				</a>
				<ThemeProvider>
					<TooltipProvider delay={200}>
						<SearchDockProvider>
							<div
								className={
									viewport
										? "relative isolate flex h-svh flex-col"
										: "relative isolate flex min-h-svh flex-col"
								}
							>
								<SiteHeader />
								<div
									className={
										viewport
											? "flex min-h-0 flex-1 flex-col overflow-hidden"
											: undefined
									}
								>
									<Outlet />
								</div>
								{viewport ? null : <SiteFooter />}
							</div>
						</SearchDockProvider>
						<Toaster richColors />
					</TooltipProvider>
					<TanStackRouterDevtools position="bottom-left" />
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
