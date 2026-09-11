"use client";

import {
	DiscountTag02Icon,
	Shield01Icon,
	SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@ibukos/ui/lib/utils";

import { SectionHeader } from "@/components/home/section-header";
import {
	type WhyChooseFeature,
	whyChooseFeatures,
} from "@/domain/kos/home-content";

const featureIcons = {
	booking: SmartPhone01Icon,
	verified: Shield01Icon,
	promo: DiscountTag02Icon,
} as const;

const featureIconStyles = {
	booking: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	verified: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	promo: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
} as const;

function FeatureCard({ feature }: { feature: WhyChooseFeature }) {
	const Icon = featureIcons[feature.id];

	return (
		<article className="feature-card group flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs sm:p-6">
			<span
				className={cn(
					"feature-card__icon flex size-11 items-center justify-center rounded-xl",
					featureIconStyles[feature.id],
				)}
			>
				<HugeiconsIcon aria-hidden="true" className="size-5" icon={Icon} />
			</span>
			<div className="flex flex-col gap-1.5">
				<h3 className="font-heading font-semibold text-sm tracking-tight sm:text-[15px]">
					{feature.title}
				</h3>
				<p className="text-pretty text-muted-foreground text-xs leading-relaxed sm:text-sm">
					{feature.description}
				</p>
			</div>
		</article>
	);
}

export function FeatureCards() {
	return (
		<section className="flex flex-col gap-4">
			<SectionHeader title="Kenapa pilih Ibukos?" />
			<div className="grid-stagger grid gap-4 sm:grid-cols-3">
				{whyChooseFeatures.map((feature) => (
					<FeatureCard feature={feature} key={feature.id} />
				))}
			</div>
		</section>
	);
}
