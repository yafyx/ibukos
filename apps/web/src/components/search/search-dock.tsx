"use client";

import { cn } from "@ibukos/ui/lib/utils";
import {
	createContext,
	type ReactNode,
	type RefObject,
	startTransition,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	ViewTransition,
} from "react";

import { LocationSearch } from "@/components/search/location-search";
import { prefersReducedMotion } from "@/lib/motion";

const locationSearchName = "location-search";

type SearchDock = {
	heroVisible: boolean;
	setHeroVisible: (visible: boolean) => void;
};

const SearchDockContext = createContext<SearchDock | null>(null);

export function SearchDockProvider({ children }: { children: ReactNode }) {
	const [heroVisible, setHeroVisibleState] = useState(true);
	const setHeroVisible = useCallback((visible: boolean) => {
		setHeroVisibleState((current) => (current === visible ? current : visible));
	}, []);
	const value = useMemo(
		() => ({ heroVisible, setHeroVisible }),
		[heroVisible, setHeroVisible],
	);

	return (
		<SearchDockContext.Provider value={value}>
			{children}
		</SearchDockContext.Provider>
	);
}

export function useSearchDock(): SearchDock {
	const dock = useContext(SearchDockContext);
	if (!dock) {
		throw new Error("useSearchDock requires SearchDockProvider");
	}
	return dock;
}

export function useHeroSearchSentinel(
	sentinelRef: RefObject<HTMLElement | null>,
): boolean {
	const { heroVisible, setHeroVisible } = useSearchDock();
	const heroVisibleRef = useRef(heroVisible);
	heroVisibleRef.current = heroVisible;

	useEffect(() => {
		const node = sentinelRef.current;
		if (!node) {
			return;
		}

		let ready = false;
		const dock = (visible: boolean) => {
			if (heroVisibleRef.current === visible) {
				return;
			}
			if (prefersReducedMotion()) {
				setHeroVisible(visible);
				return;
			}
			startTransition(() => {
				setHeroVisible(visible);
			});
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) {
					return;
				}
				if (!ready) {
					ready = true;
					setHeroVisible(entry.isIntersecting);
					return;
				}
				if (heroVisibleRef.current) {
					if (entry.intersectionRatio <= 0.15) {
						dock(false);
					}
					return;
				}
				if (entry.intersectionRatio >= 0.6) {
					dock(true);
				}
			},
			{
				rootMargin: headerRootMargin(),
				threshold: [0, 0.15, 0.6, 1],
			},
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [sentinelRef, setHeroVisible]);

	return heroVisible;
}

export function LocationSearchSlot({
	className,
	size,
}: {
	className?: string;
	size: "hero" | "chrome";
}) {
	return (
		<ViewTransition default="none" name={locationSearchName} share="morph">
			<div
				className={cn(
					"overflow-hidden rounded-lg",
					size === "hero" ? "w-full" : null,
					className,
				)}
			>
				<LocationSearch size={size} />
			</div>
		</ViewTransition>
	);
}

function headerRootMargin(): string {
	const height = getComputedStyle(document.documentElement)
		.getPropertyValue("--site-header-height")
		.trim();
	return `-${height.length > 0 ? height : "3.5rem"} 0px 0px 0px`;
}
