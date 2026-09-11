export type PageChrome = { kind: "document" } | { kind: "viewport" };

export function chromeFromMatches(
	matches: readonly { staticData?: { chrome?: PageChrome } }[],
): PageChrome {
	for (let index = matches.length - 1; index >= 0; index -= 1) {
		const chrome = matches[index]?.staticData?.chrome;
		if (chrome) {
			return chrome;
		}
	}
	return { kind: "document" };
}

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		chrome?: PageChrome;
	}
}
