export type HighlightSource = "list" | "pin";
export type HighlightInput = "pointer" | "keyboard";

export type Highlight =
	| { kind: "none" }
	| { kind: "hover"; slug: string; source: HighlightSource; input: "pointer" }
	| {
			kind: "active";
			slug: string;
			source: HighlightSource;
			input: HighlightInput;
	  };

export type HighlightEvent =
	| {
			type: "enter";
			slug: string;
			source: HighlightSource;
			input: HighlightInput;
	  }
	| { type: "leave"; slug: string; source: HighlightSource }
	| {
			type: "select";
			slug: string;
			source: HighlightSource;
			input: HighlightInput;
	  };

export const highlightNone: Highlight = { kind: "none" };

export function reduceHighlight(
	current: Highlight,
	event: HighlightEvent,
): Highlight {
	switch (event.type) {
		case "enter":
			if (event.input === "keyboard") {
				return {
					kind: "active",
					slug: event.slug,
					source: event.source,
					input: "keyboard",
				};
			}
			if (current.kind === "active" && current.slug === event.slug) {
				return current;
			}
			return {
				kind: "hover",
				slug: event.slug,
				source: event.source,
				input: "pointer",
			};
		case "leave":
			if (current.kind === "none") {
				return current;
			}
			if (current.slug !== event.slug || current.source !== event.source) {
				return current;
			}
			if (current.kind === "active") {
				return current;
			}
			return highlightNone;
		case "select":
			return {
				kind: "active",
				slug: event.slug,
				source: event.source,
				input: event.input,
			};
	}
}

export function highlightSlug(highlight: Highlight): string | undefined {
	return highlight.kind === "none" ? undefined : highlight.slug;
}

export function highlightIsSelected(
	highlight: Highlight,
	slug: string,
): boolean {
	return highlight.kind !== "none" && highlight.slug === slug;
}
