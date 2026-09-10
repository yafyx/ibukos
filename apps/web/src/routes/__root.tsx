import { useEffect } from "react";
import { Toaster } from "@ibukos/ui/components/sonner";
import { TooltipProvider } from "@ibukos/ui/components/tooltip";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { SiteFooter } from "../components/chrome/site-footer";
import { SiteHeader } from "../components/chrome/site-header";
import { ThemeProvider } from "../components/chrome/theme-provider";

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
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Ibukos",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/brand/ibukos-ibu.png",
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      void import("react-grab");
    }
  }, []);

	return (
		<html lang="id" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="relative">
				<ThemeProvider>
					<TooltipProvider delay={200}>
						<div className="relative isolate flex min-h-svh flex-col">
							<SiteHeader />
							<Outlet />
							<SiteFooter />
						</div>
						<Toaster richColors />
					</TooltipProvider>
					<TanStackRouterDevtools position="bottom-left" />
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
