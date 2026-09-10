import { Button } from "@ibukos/ui/components/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@ibukos/ui/components/card";
import { Link } from "@tanstack/react-router";

import { KosImage } from "@/components/media/kos-image";

const ownerPhoto =
	"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80";

export function OwnerBanner() {
	return (
		<Card className="py-0 sm:grid sm:grid-cols-[1fr_minmax(12rem,18rem)] sm:items-stretch">
			<CardHeader className="justify-center gap-3 py-5 sm:py-6">
				<CardTitle className="font-heading text-lg font-semibold tracking-tight text-pretty">
					Daftarkan kos kamu di Ibukos
				</CardTitle>
				<CardDescription className="text-sm text-pretty">
					Jangkau pencari kos di kota dan kampus se-Indonesia.
				</CardDescription>
				<Button render={<Link to="/login" />}>Daftarkan kos</Button>
			</CardHeader>
			<CardPanel className="hidden p-0 sm:block">
				<KosImage
					alt=""
					className="h-full min-h-40 w-full object-cover"
					height={280}
					src={ownerPhoto}
					width={420}
				/>
			</CardPanel>
		</Card>
	);
}
