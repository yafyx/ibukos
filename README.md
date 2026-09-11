# Ibukos

> How well can you use AI to build frontend products effectively and efficiently?

A kos finder inspired by Mamikos. Take-home in `[task.md](./task.md)`. [Demo](https://ibukos.yfyx.dev).

[TanStack Start](https://tanstack.com/start) (React 19, SSR), [Tailwind v4](https://tailwindcss.com), [coss](https://coss.com/ui) and [shadcn](https://ui.shadcn.com) on [Base UI](https://base-ui.com), [Leaflet](https://leafletjs.com), [Bun](https://bun.sh), [Turborepo](https://turborepo.dev), [Biome](https://biomejs.dev).

I shipped the home page inside the 3–5 hour window. Everything after that was optional. I kept going because I enjoy building this kind of thing: search, listing detail, city and campus landings, the small interaction details that connect them. The brief asks for a clone inspired by Mamikos. I read that as the same product space, with room to make my own calls.

`/login` and `/dashboard` are [Better-T-Stack](https://better-t-stack.dev) leftovers. [Better Auth](https://www.better-auth.com) is wired with no database. Removing them wasn't worth the time.

## On How I used the agent

I started with [Better-T-Stack](https://better-t-stack.dev), the CLI that scaffolds a TypeScript monorepo. Mine came with TanStack Start, Tailwind, Biome, Turborepo, and Better Auth. Then [shadcn/create](https://ui.shadcn.com/create) for the UI. The agent sliced the brief and we iterated in the browser. **I assumed I could get a 1:1 home from Figma capture extensions in under an hour, but skipped that route on purpose.**

Cursor GUI until the screen recording chewed the laptop. Then Cursor CLI inside Zed. Nearly every change still went through the agent. I steered, checked the browser, and pushed back.

What worked was pointing at one element and saying what's wrong. In the GUI I used [Design Mode](https://cursor.com/docs/agent/design-mode). Click an element in the running app, prompt against it. After the CLI switch, [react-grab](https://github.com/aidenybai/react-grab) did the same job. Click the broken bit, paste the component context, keep going.

Where the agent saved the most time:

- Opening chat. After [Better-T-Stack](https://better-t-stack.dev), I asked it to make a site "inspired or better than mamikos.com named ibukos," with [coss](https://coss.com/ui) and the shadcn registry, light as the default, dark switch in the footer, Hugeicons, Embla. Workers on Composer. Grok 4.6 High only for judging. Then "implement all available coss ui components," then "i mean not use all of components but always make use the coss ui components."
- `/cari`. I ran this through [pstack](#on-supervision-is-the-job) (`/poteto-mode`). Copy [Zumper](https://www.zumper.com/apartments-for-rent/san-francisco-ca), Leaflet, better than Mamikos, `/emil-design-eng` always, this branch. Next message. "dont use cua dirver." I didn't want a computer-use agent driving the browser. What happened next (map the search domain, four architecture candidates, one [LLM-as-a-judge](https://arxiv.org/abs/2306.05685)) is in that section. The winner shipped.
- SEO. "now maximizes the seo for this sites." Then "dont verify the output." Then "use [takumi.kane.tw](https://takumi.kane.tw/) for OG images." Landings, [JSON-LD](https://json-ld.org), sitemap, OG routes came out of that.

Where it went sideways:

- First home. "the current sites layout is soulles. and not like mamikos.com at all. u might wanted to screenshoot the page first using [firecrawl](https://www.firecrawl.dev)." I meant Mamikos and Zumper. It opened [Cursor's browser](https://cursor.com/docs/agent/tools/browser) on `localhost:3001` and ran `browser_take_screenshot` (full page) on our home. [Firecrawl](https://www.firecrawl.dev) CLI (`firecrawl scrape --full-page-screenshot`) did hit the references in the background. "why did u screenshoot our own sites?"
- Command. `/coss` to replace the hero search. Base UI lost `ComboboxGroupContext`. Fade on the rounded corner, padding, the search icon. Several more rounds.
- [Playwright](https://playwright.dev). Agents kept reaching for it to verify layout, and they always wanted to download Google Chrome (`google-chrome`, Chromium). I don't use Chrome. I use Dia. On `/cari` I said "dont install playwright or chromium, remove it." Later, "never run browser again."

Skills I used:

- `emil-design-eng`. Motion, hover, the polish bar on UI prompts.
- `better-interface`. Layout, a11y, type, color, copy. The judge after a revamp.
- `coss` / `coss-particles`. Component patterns from the coss registry.
- `animate` / `find-animation-opportunities`. What to move, and how.
- `poteto-mode`. pstack .
- `no-ai-slop` / `human-writing`. Copy passes.
- `tanstack-start`. 
- `thermo-nuclear-code-quality-review`. One code review.
- `cloudflare`. Deploy.

The agent also pulled `better-ui`, `better-layout`, and `better-accessibility` on its own.

## On supervision is the job

Most of the orchestration (`poteto-mode`, `architect`, `arena`) is lauren's [pstack](https://x.com/i/article/2094940651607715840). She called it "the art of supervising someone smarter than you." First time I used it, I was working in a git worktree. The agent knew Base UI's API, TanStack's `head()`, and the View Transitions pseudo-elements better than I did. What it didn't know was what a kos listing should feel like to a student on a phone at 11pm, or when a folder tab looks off by two pixels. My job was that second half.

Through `poteto-mode` I used `never-block-on-the-human`. The agent read that rule eight times. Stop asking and go. Lauren plans through code. Prototypes let agents answer their own questions with evidence instead of waiting. For UI I don't have the plan until I see something wrong. Eight of my prompts start with "i mean." Twenty-three start with a screenshot, usually with rulers from [Mesurer](https://mesurer.dev/). An interview at 2am would have produced a confident spec for a layout I'd have rejected on sight. A wrong version I can point at costs one message. She wrote that abstract plans only give you the illusion of progress.

Architecture is the exception. For `/cari` I pointed at Zumper and Mamikos and said copy that, better, Leaflet. The architect run wrote the rubric. Four agents proposed. One graded.

If an agent can't verify its own work, nothing else matters. You remain the bottleneck. It kept reaching for Playwright. I said some version of "lemme verify manually" eight times, then "never run browser again." Looking was faster than debugging a harness. The 25 tests cover search parsing, catalog grouping, and canonical rules. The agent wrote those. I kept verifying the UI myself.

Cheap fast workers write, one expensive model reads and scores. Grok only ever read. It graded those four candidates and picked the one that shipped. `/cari` is the best-structured part of the repo because of that review. It cost a fraction of running the whole build on the expensive model. If I only had budget for one expensive call, I'd spend it on the judge again.

## On The interface

Home has a [command palette](https://en.wikipedia.org/wiki/Command_palette) in the hero, then promo folders by city, featured listings, popular areas and campuses. `/cari` is a [Zumper](https://www.zumper.com)-style [split view](https://developer.apple.com/design/human-interface-guidelines/split-views). List on one side, map on the other. A [segmented control](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) switches Daftar / Gabungan / Peta. Filters, sort, and committed map bounds live in the URL. A listing is `/kos/$slug`. `/kota/*`, `/kampus/$slug`, and `/tipe/$gender` are [programmatic SEO](https://ahrefs.com/blog/programmatic-seo) landings into `/cari`. Crawlers get `/og/*`, `/sitemap.xml`, and `/robots.txt`.

Scroll past the hero and the search box docks into the header. The morph is a same-document [view transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), React `[<ViewTransition>](https://react.dev/reference/react/ViewTransition)`, and `.morph` in `index.css`. Code is in `apps/web/src/components/search/search-dock.tsx`.

![Search box docking into the header on scroll](docs/screenshots/home-search-dock.gif)

The search dialog is a coss `[Command](https://coss.com/ui/docs/components/command)` on Base UI Autocomplete. Empty state is a browse panel: "Cari di lokasi sekitar saya" (geolocation, snapped to the nearest catalog city), campus chips, then Kampus / Area / Stasiun & Halte with a city accordion. Typing filters. Enter with free text goes to `/cari?q=`. Full-screen on a phone.

![Command dialog](docs/screenshots/search-dialog.gif)

Save is a Base UI `Toggle` in `localStorage`. On save the chip widens, "Disimpan" slides out, holds 1.4s, collapses over 200ms. On remove the icon lifts out over 550ms, no text. Both write to `aria-live`. Same chip on cards, promo folders, and detail.

![Save chip mid-feedback](docs/screenshots/save-chip.gif)

You can't draw an S-curve corner in CSS. I learned that from Emil Kowalski's [Devouring Details notch](https://devouringdetails.com/prototypes/nextjs-dev-tools). The tail is an SVG glued to a normal HTML box, so the label can grow without breaking the curve. I rebuilt it for "Kos yang lagi promo", where seven city tabs have to read as one folder.

Switching cities changes widths and overlaps. Labels must not stretch while that happens, so `useFlip` runs [FLIP](https://aerotwist.com/blog/flip-your-animations/). Mid-flight switches cancel and snapshot from the visual position, so you can spam the tabs without a jump. Cards fade in with `@starting-style`. The count is `tabular-nums` so "2" and "1" don't shove the name around.

![Switching promo folders by city](docs/screenshots/promo-folder.gif)

Daftar / Gabungan / Peta. The panes resize; nothing else animates. Pins are Leaflet `DivIcon`s with the price, colored by gender like the cards. Hover a card or a pin and the other highlights. Click a pin and its card scrolls into view. Panning does not re-query. "Cari di area ini" writes the bounds into the URL, so back and forward work. Under 64rem it becomes a list with a floating Daftar / Peta control.


| Desktop split                                                 | Mobile                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| ![Toggle List / Split / Map](docs/screenshots/cari-views.gif) | ![Mobile list with floating toggle](docs/screenshots/cari-mobile.png) |


[Embla](https://www.embla-carousel.com) carousel with a thumbnail strip. On a mouse, the next arrow stays hidden until you hover the image, then fades in as a full-height gradient. It unmounts on the last slide rather than sitting there disabled. On a phone it stays visible, and you can swipe. Sticky card: price, availability, WhatsApp, copy link, report.

![Listing detail](docs/screenshots/kos-detail.gif)

## Decisions worth explaining

shadcn/create picked Base UI. Radix is still supported. I followed the default and kept moving.

Search state is in the URL. `parseSearchQuery` validates the search object and feeds `searchListings`. While the map is moving, bounds stay in the map. "Cari di area ini" commits them. Back and forward get a stable search without navigating on every drag.

`map-island.tsx` lazy-loads `map-canvas.tsx` and shows a skeleton until the client is ready. Listing detail uses the same pattern. Routes don't deal with Leaflet.

The catalog has no lat/lng. `listingCoords` hashes each slug and offsets a city center. The pins are stable fakes.

`/cari` declares a viewport layout in `staticData`. `chromeFromMatches` reads it from the matched route. The root layout has no pathname list.

Home has skeleton components for its data-driven rows. The map has one while Leaflet loads.

I used Embla for the photo strip. I did not want to write swipe and thumbnail behavior from scratch.

Light is the default. `theme-provider.tsx` sets light and disables system theme. The switch lives in the footer so the header can stay on search and nav.

## SEO without Next.js

A listing site lives on search traffic, and Next.js is the default answer: Metadata API, `sitemap.ts`, `robots.ts`, `next/og`. I picked TanStack Start anyway, for `/cari`. That page is a URL with 13 typed search params, and TanStack Router validates every one at the route boundary. That mattered more than free metadata helpers. I bet the agent could rebuild the SEO layer in an hour. It took about forty minutes.

What shipped, all under `apps/web/src/domain/seo/`:

- `seoHead()` builds title, description, robots, canonical, Open Graph, and Twitter tags from one `SeoDocument`. Every route calls it from TanStack's `head()`.
- JSON-LD: `Organization`, `WebSite` with a `SearchAction`, `FAQPage` on home, `BreadcrumbList` and `Apartment` with an IDR `Offer` on listings, `CollectionPage` + `ItemList` on landings.
- Canonical policy for `/cari`. A search that maps to a landing gets `noindex, follow`. Extra filters stay unindexed.
- `sitemap.xml` (55 URLs) and `robots.txt`. OG images at `/og/*`. Web manifest, `lang="id"`, `og:locale` `id_ID`.

I reviewed the canonical rules by hand. Eight unit tests cover them: city-only search canonicalizes to the landing and is not indexed, bare `/cari` stays indexed, facility filters stay on `/cari` unindexed, the JSON-LD offer uses the promo price when there is one.

Paste a link in WhatsApp or X and the preview card comes from Open Graph. Every indexable page points at a PNG the server renders on demand. I copied Mamikos's layout: full green (`#247a4a`), white type, the ibu logo and "Ibukos" in the top right. Listing cards put the first photo on the left. Takumi turns the JSX into a 1200×630 PNG. I picked it over Satori because it ships with the same React-to-image model and the agent already had it wired.


| Home                                          | Listing                                             |
| --------------------------------------------- | --------------------------------------------------- |
| ![Home OG card](docs/screenshots/og-home.png) | ![Listing OG card](docs/screenshots/og-listing.png) |


Mamikos still ships a relative `og:image`. X wants an absolute URL, so the checker drops the image. Ibukos runs every image through `absoluteUrl()` in `seoHead()`, so production tags look like `https://ibukos.yfyx.dev/og`.

![Mamikos X preview missing its OG image](docs/screenshots/og-mamikos-x-checker.jpg)

## Running it

```bash
bun install
bun run dev        # http://localhost:3001
```

```bash
bun test apps/web/src   # 25 unit tests: search, catalog, SEO
bun run check-types     # tsc across the workspace
bun run check           # Biome lint + format
bun run build
```

Create `apps/web/.env` first. Env validation fails without it, even though the UI never touches auth:

```bash
BETTER_AUTH_SECRET=any-string-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3001
```

## If I had more time

Real coordinates and a real data source. Working auth, or strip it. Virtualize the `/cari` list once the catalog passes 30.

The rest is continuous improvement like the promo folder.

![Live debug overlay while morphing a tab cutout](docs/screenshots/tab-cutout-debug.gif)

Thank you for reading all of this. You didn't have to stay this long, and I don't take it lightly. I wrote more than the brief asked because I care about this kind of product.

ᢉ𐭩