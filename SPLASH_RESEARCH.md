# Splash Intro & Motion Research — Maldevera.com

Research backing the cinematic first-visit splash + transition polish work.
Date: 2026-06-28 · Branch: `splashAnimation`

---

## Method

- Reviewed the official sites of high-tier death/thrash/groove/tech-metal acts.
- Note: most "official" band domains today are **Shopify/merch storefronts** (Lorna Shore, Spiritbox, Behemoth, Meshuggah, Cattle Decapitation). Their HTML is e-commerce boilerplate, so JS-driven motion isn't visible to a static fetch. Findings below combine what was observable with well-established motion-design practice for the genre.

## Per-site observations

| Band | Intro/splash | Logo reveal | Ambient FX | Palette / type | Notes |
|------|-------------|-------------|------------|----------------|-------|
| **Lorna Shore** | None — opens to merch grid | Central white logo + separate sigil mark in footer | None on store; campaign microsites use fog/embers + sigil | Black bg, white text, modern sans | Dual-mark system (wordmark + sigil) is worth copying |
| **Cattle Decapitation** | None | Central wordmark over ouroboros sigil; "substance over spectacle" | Static, art-led | Monochrome white-on-dark | Lets album art dominate; minimal motion |
| **Spiritbox** | "Loading…" indicator (content loads dynamically) | Logo repeated in header as home link | Large hero photography, carousel transitions | Dark, high-contrast | Even a polished act uses a plain loader, not a cinematic gate |
| **Behemoth** | None | Logo as clickable home mark | Scroll-reveal of album art | Dark, minimal, high-contrast | Spectacle lives in their videos, not the site chrome |
| **Meshuggah** | None | Centered logo, "Let there be metal" tagline | Minimal, navigation-focused | Dark, functional | Deliberately utilitarian |
| **Gojira** (403/blocked) | Known: atmospheric, full-bleed imagery, restrained | Centered wordmark | Subtle, art-led | Dark, earthy | Cinematic feel via photography + spacing, not heavy JS |

## What the big acts actually do

1. **The main site stays clean.** Repeat-visitor flows (merch, tour, news) are never gated. Cinematic spectacle is reserved for album-campaign microsites and music videos.
2. **Dark, high-contrast, monochrome.** Near-black backgrounds, white/bone wordmarks, one accent at most. Texture and contrast do the heavy lifting.
3. **Dual-mark branding.** A full wordmark *plus* a compact sigil/icon (Lorna Shore, Cattle Decapitation). The sigil is the natural "loading" focal point.
4. **Motion is subtle and physical.** Slow fades, scroll-reveals, gentle parallax — never spinners, never bounce. It should feel like *stage lighting*, not a web gimmick.
5. **Performance is sacred.** No multi-second unskippable intros; LCP/CLS kept clean so the merch funnel isn't hurt.

---

## Transferable patterns for Maldevera (4–6)

Maldevera already owns a strong dark/Lovecraftian motion vocabulary — rain video, lightning-capable overlay, a `.lightrope` lights string, a flashlight/darkness mode, two themes (`lovecraftian`/`alien`). The splash should **speak that existing language**, not import a new one.

1. **First-visit-only "lights down" splash.** Full-viewport near-black overlay; the bone-textured logo resolves in center; one restrained lightning flash backlights it (reuse the rain/lightning assets); hold ~1s; dissolve to reveal the site already rendered behind it. Lights going down before a set.
2. **Reveal-not-load.** The site renders *underneath* the overlay immediately; the splash is a curtain that lifts, so it adds **zero perceived load delay** (vs. a gate that blocks render). This is the Spiritbox "loader" idea done with intent.
3. **Bone-texture grain on the reveal.** A faint film-grain/texture fade-in on the logo ties to the BONE_TEXTURE asset and the Lovecraftian theme — texture over slickness.
4. **Always skippable, never repeated.** Click / tap / scroll / any key dismisses instantly. `sessionStorage` flag so it fires once per browsing session, never on internal route changes — protects repeat visitors (merch/chat/tour).
5. **Soft route crossfade.** 200–300ms opacity crossfade on route changes so navigation feels deliberate and premium, not snappy/cheap. The single highest-ROI "professional" upgrade after the splash.
6. **Micro-interactions on CTAs.** Subtle hover lifts / glow on buttons and nav, tuned to the active theme accent — small, consistent, restrained.

## Explicitly avoid

- ❌ Multi-second **unskippable** gates (>2.5s perceived).
- ❌ **Autoplaying audio** on the splash (the site already has an audio player; don't fight it or violate browser autoplay policy).
- ❌ **Spinner-looking** logo animations (rotation/bounce read as "loading bug," not cinematic).
- ❌ **Layout shift / CLS** — overlay must sit above a fully-laid-out page; logo space reserved.
- ❌ **Re-triggering** the full splash on every internal navigation.
- ❌ New **heavy animation libraries** (Framer Motion, GSAP, three.js) — CSS keyframes + the Web Animations API + existing assets cover all of this. No bundle bloat on a CRA app.
- ❌ Ignoring **`prefers-reduced-motion`** — those users get an instant/short clean fade, no flash, no grain churn.

## Acceptance bar (carried into Phase 2/3)

Shows on first visit · skippable (click/tap/scroll/key) · respects reduced-motion · zero meaningful load delay (reveal, not gate) · reuses existing rain/lights/flashlight/theme assets · no new heavy deps · breaks none of the current theme/lights/flashlight/rain behavior · ships on `splashAnimation` with a clear PR.
