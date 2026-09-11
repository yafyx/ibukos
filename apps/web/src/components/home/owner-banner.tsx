import { Button } from "@ibukos/ui/components/button";
import { Card } from "@ibukos/ui/components/card";
import { Link } from "@tanstack/react-router";

export function OwnerBanner() {
	return (
		<section aria-labelledby="owner-banner-title">
			<Card className="flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 bg-primary/[0.04] py-4">
				<div className="flex min-w-0 flex-col gap-1 px-(--card-spacing)">
					<h2
						className="text-pretty font-heading font-semibold text-sm tracking-tight sm:text-base"
						id="owner-banner-title"
					>
						Isi kamar kos lebih cepat
					</h2>
					<p className="text-pretty text-muted-foreground text-xs leading-relaxed sm:text-sm">
						Iklankan gratis. Listing terverifikasi, siap dipromosikan.
					</p>
				</div>
				<div className="px-(--card-spacing)">
					<Button render={<Link to="/login" />}>Iklankan kos</Button>
				</div>
			</Card>
		</section>
	);
}
