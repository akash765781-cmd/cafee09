# UK 09 — Restaurant Website, Bathinda

A single-page-feel, editorial restaurant site with separate routes for SEO, built around: Food → Atmosphere → Trust → Location → Action.

Note: the menu image referenced in the brief did not arrive with the message. The menu section will be built as a real digital menu interface using clearly marked `[MENU ITEM]` / `[PRICE]` placeholders and neutral category labels, ready to be filled the moment you upload the photo. No dishes, prices, or cuisine claims will be invented.

## Brand direction

- Typographic wordmark only: **UK 09**, set in a bold condensed grotesk with wide-tracked "09" — no icon or emblem.
- Palette: deep charcoal base, warm cream secondary surface, dark warm gray cards, warm white / muted beige-gray text, chili red accent used sparingly (CTAs, active tab, small labels), burnt terracotta as support.
- Type pairing: bold editorial grotesk for headings (Archivo/Bebas-family weight and presence), clean neutral sans for body.
- Restrained motion: fade-up section reveals, slow image zoom on hover, navbar scroll transition, tab crossfade. Full `prefers-reduced-motion` support.

## Pages

- `/` — full experience (hero → info strip → featured menu → food feature → about → gallery → reviews → hours → location → final CTA)
- `/menu` — the full digital menu with category tabs
- `/about` — story + atmosphere
- `/reviews` — 5.0 ★ · 14 Google reviews, themes only, no fabricated quotes or names
- `/location` — address, plus code, map, hours, directions/call

Each route gets its own `head()` metadata (title, description, og/twitter). Home carries LocalBusiness/Restaurant JSON-LD with only supplied facts: name, address, phone, daily 10:00–23:00 hours, aggregate rating 5.0 / 14.

## Section-by-section

1. **Navbar** — wordmark left; Home / Menu / About / Reviews / Location; "Call" accent CTA. Transparent over hero, solid warm-charcoal after scroll. Mobile hamburger with Call, Directions, Menu surfaced first.
2. **Hero** — cinematic full-bleed food/interior image, dark warm overlay, subtle grain. Eyebrow `BATHINDA • DINING & FOOD`, headline "Good Food. Great Vibe. UK 09.", supporting line, CTAs View Menu / Get Directions, utility line "Open Daily • 10 AM–11 PM".
3. **Info strip** — four compact cells: Hours, Dine-In, Location, Phone. Phone is a `tel:` link.
4. **Featured menu** — horizontally scrollable category tabs (accent underline on active) + menu cards with placeholder names/prices, "Explore Full Menu" CTA linking to `/menu`.
5. **Food feature** — near-full-bleed food image, "Made for cravings. Made for sharing." with the supplied supporting copy. Image-led, minimal text.
6. **About** — asymmetric split, "A Place to Eat, Relax & Stay Awhile", location context (inside Hotel Green In, opposite Park View Resorts). No invented history.
7. **Gallery / atmosphere** — offset editorial grid (varied crops, not a uniform 3-up), "More Than a Meal". Captions describe scene type, never claim to be UK 09's own photos.
8. **Reviews** — 5.0 ★ · 14 Google Reviews stat block plus theme cards (great food, cozy atmosphere, friendly staff, good vibe) presented as themes, not quotes. "View All Reviews" links to the Google listing.
9. **Hours** — seven-row card, all days 10:00 AM–11:00 PM. Open/closed status computed from the visitor's clock in Asia/Kolkata, rendered after hydration; no hardcoded "Open Now".
10. **Location** — dark section with address, plus code 6XH3+FJ, embedded Google map framed inside the layout (bordered, warm-toned, not a bare rectangle), Get Directions + Call buttons.
11. **Final CTA** — "Your Table. Your People. Your Evening." with Get Directions primary, Call secondary, WhatsApp tertiary (wa.me link to the listed number).
12. **Footer** — wordmark + one-line descriptor, nav column, contact, address, hours, utility links.
13. **Mobile sticky bar** — Call | Menu | Directions, hidden on desktop, hidden while the final CTA is in view so it doesn't duplicate.

## Imagery

Generated cinematic, warm, high-contrast food and interior photography used as neutral placeholders — no smiling stock models, no fake claims that a shot is UK 09's own. Descriptive alt text, consistent crops, `object-fit: cover`, lazy loading below the fold.

## Technical

- TanStack Start routes under `src/routes/`; reusable components in `src/components/` (Navbar, Hero, InfoStrip, MenuTabs, MenuCard, FoodFeature, AboutSection, Gallery, ReviewCard, ReviewsSection, HoursCard, LocationSection, CTASection, Footer, MobileActionBar).
- All colors as semantic oklch tokens in `src/styles.css` (`@theme inline`); no hardcoded color utilities.
- Fonts loaded via `<link>` in `src/routes/__root.tsx`.
- Semantic HTML, single H1 per page, visible focus rings, 44px touch targets, AA contrast.
- No backend needed — static content, no reservation system implied.

## What I need from you later

- The menu image (or typed menu) to replace the placeholders.
- Any real photos of the restaurant and dishes.
- WhatsApp number if it differs from 081969 96909.
