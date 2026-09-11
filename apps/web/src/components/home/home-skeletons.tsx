import { Skeleton } from "@ibukos/ui/components/skeleton";
import { cn } from "@ibukos/ui/lib/utils";

import { FolderNotch } from "@/components/home/folder-notch";
import { SectionHeader } from "@/components/home/section-header";

function ListingCardSkeleton() {
	return (
		<div className="flex h-full flex-col gap-0 overflow-hidden rounded-xl bg-card p-1 ring-1 ring-foreground/10 ring-inset">
			<Skeleton className="aspect-[4/3] w-full rounded-lg" />
			<div className="flex flex-col gap-2 px-2 py-2">
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-3 w-3/4" />
				<Skeleton className="mt-1 h-5 w-24" />
			</div>
		</div>
	);
}

export function ListingRowSkeleton({ title }: { title: string }) {
	return (
		<section aria-busy="true" className="flex flex-col gap-4">
			<SectionHeader title={title} />
			<div aria-hidden="true" className="promo-folder">
				<div className="promo-folder-nav">
					{Array.from({ length: 4 }, (_, index) => {
						const isFirst = index === 0;

						return (
							<FolderNotch active={isFirst} key={index}>
								<div className="p-1">
									<Skeleton className="h-7 w-16 rounded-md" />
								</div>
							</FolderNotch>
						);
					})}
				</div>
				<div className="promo-folder-body">
					<div className="flex gap-4 overflow-hidden px-4">
						{Array.from({ length: 4 }, (_, index) => (
							<div className="w-[min(17rem,78vw)] shrink-0 sm:w-72" key={index}>
								<ListingCardSkeleton />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export function FeaturedGridSkeleton() {
	return (
		<section aria-busy="true" className="flex flex-col gap-4">
			<SectionHeader title="Rekomendasi kos" />
			<div className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }, (_, index) => (
					<ListingCardSkeleton key={index} />
				))}
			</div>
		</section>
	);
}

function PhotoAreaTileSkeleton() {
	return <Skeleton className="aspect-[4/3] w-full rounded-xl" />;
}

function CampusAreaTileSkeleton() {
	return (
		<div className="flex flex-col items-center gap-2 px-2 py-3 sm:gap-3 sm:py-4">
			<Skeleton className="size-16 rounded-2xl sm:size-[4.5rem]" />
			<div className="flex w-full flex-col items-center gap-1">
				<Skeleton className="h-3.5 w-12" />
				<Skeleton className="h-3 w-16" />
			</div>
		</div>
	);
}

export function AreaGridSkeleton({
	title,
	variant,
	className,
}: {
	title: string;
	variant: "photo" | "campus";
	className?: string;
}) {
	return (
		<section aria-busy="true" className={cn("flex flex-col gap-4", className)}>
			<SectionHeader title={title} />
			<div
				className={cn(
					"grid gap-2 sm:gap-4",
					variant === "photo" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-4",
				)}
			>
				{Array.from({ length: 8 }, (_, index) =>
					variant === "photo" ? (
						<PhotoAreaTileSkeleton key={index} />
					) : (
						<CampusAreaTileSkeleton key={index} />
					),
				)}
			</div>
		</section>
	);
}
