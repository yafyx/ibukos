"use client";

import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from "@ibukos/ui/components/accordion";

import { SectionHeader } from "@/components/home/section-header";
import { homeFeatures } from "@/domain/kos/home-content";

export function FeatureAccordion() {
	return (
		<section className="flex flex-col gap-3 border-t pt-6 sm:pt-8">
			<SectionHeader title="Fitur yang dapat dimanfaatkan di Ibukos" />
			<Accordion
				className="rounded-xl border bg-card px-4"
				defaultValue={["search"]}
			>
				{homeFeatures.map((feature, index) => (
					<AccordionItem key={feature.id} value={feature.id}>
						<AccordionTrigger>
							<span>
								{index + 1}. {feature.title}
							</span>
						</AccordionTrigger>
						<AccordionPanel>{feature.description}</AccordionPanel>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
