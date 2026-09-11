import { Link } from "@tanstack/react-router";

import { createEmptyQuery } from "@/domain/facets/url";

export function NotFoundPage() {
	return (
		<main
			className="page-shell flex flex-col gap-4 py-16"
			id="main"
			tabIndex={-1}
		>
			<h1 className="font-heading font-semibold text-2xl tracking-tight">
				Halaman tidak ditemukan
			</h1>
			<p className="max-w-md text-muted-foreground text-sm">
				Linknya salah atau kosnya sudah tidak tayang. Cari listing lain dari
				beranda atau halaman cari.
			</p>
			<div className="flex flex-wrap gap-3">
				<Link
					className="font-medium text-sm underline-offset-4 hover:underline"
					to="/"
				>
					Beranda
				</Link>
				<Link
					className="font-medium text-sm underline-offset-4 hover:underline"
					search={createEmptyQuery()}
					to="/cari"
				>
					Cari kos
				</Link>
			</div>
		</main>
	);
}
