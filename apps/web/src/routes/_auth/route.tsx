import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { seoHead } from "@/domain/seo/head";
import { privateDocument } from "@/domain/seo/pages";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
	head: () => seoHead(privateDocument("Akun", "/dashboard")),
	beforeLoad: async () => {
		const session = await getUser();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
		return { session };
	},
	loader: async ({ context }) => {
		if (!context.session) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

function AuthLayout() {
	return <Outlet />;
}
