const STORAGE_KEY = "ibukos:saved-kos";

function readSaved(): string[] {
	if (typeof window === "undefined") {
		return [];
	}
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return [];
		}
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === "string")
			: [];
	} catch {
		return [];
	}
}

function writeSaved(slugs: string[]) {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

export function isKosSaved(slug: string): boolean {
	return readSaved().includes(slug);
}

export function toggleSavedKos(slug: string): boolean {
	const current = readSaved();
	const next = current.includes(slug)
		? current.filter((item) => item !== slug)
		: [...current, slug];
	writeSaved(next);
	return next.includes(slug);
}
