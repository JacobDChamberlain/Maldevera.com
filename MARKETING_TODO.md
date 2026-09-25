# Marketing TODO

Entry point for the marketing / discoverability work. The full reasoning — how
analytics work, what the numbers mean, the distribution plan, the positioning
argument — lives in the **Maldevera Marketing Playbook**:

https://claude.ai/code/artifact/5fe974f6-3255-4684-9830-6030c98f0530

This file is the short version so it's findable from the repo.

---

## Shipped 2026-09-24 — PR #123, merged and live

- **Link previews.** There were no Open Graph or Twitter tags at all, so every
  shared link rendered as a bare grey URL. Added, with a 1200×630 image at
  `frontend/public/images/og-maldevera.jpg`.
- **Search.** `sitemap.xml`, tightened `robots.txt`, `MusicGroup` JSON-LD in
  `index.html`, and `MusicEvent` JSON-LD for upcoming shows
  (`Pages/Shows/ShowsJsonLd.js`) including door times and ticket prices.
- **Page weight.** The footer player defaulted to `preload="auto"` against the
  WAV masters — every visitor downloaded 57–82 MB on arrival. Now ~6 MB MP3s
  that load only on play. Production build went from ~1.1 GB to 157 MB.
- **`/press`** rebuilt from the real EPK: bio, Metal News review, shared-stage
  list, live shots, videos, booking. 65 MB PDF → 563 KB servable version.
- **`/about`**: real bio, tour cities in two columns, instruments per member.
- **Social bar**: Bandcamp added (was missing entirely), YouTube pointed at the
  channel instead of one video, links open in a new tab.
- **Analytics**: Cloudflare Web Analytics beacon, live with the real token.
- **Sitemap submitted** to Google Search Console (2026-09-24). The domain was
  already verified from some earlier round; only the sitemap was outstanding.
  Coverage lands in Search Console → Sitemaps, and tells you which pages got
  indexed. At submission `site:maldevera.com` returned `/`, `/about`, `/merch`
  and `/shows` — `/press` and `/tours` had not been crawled yet.

## Shipped 2026-09-24 — PR #125

- **Lineup corrected to the current band.** Stephan Cohen is the drummer;
  Shannon Paine-Jesam played 2014-2025. `/press` gained a Lineup section with a
  credit line for Shannon, `/about`'s flip card inverted so Stephan is the face
  and Shannon is behind him, and the `MusicGroup` JSON-LD `member` array was
  corrected — it still listed Shannon.
- **New Orleans removed from `/press`** (subtitle, bio, JSON-LD description).
  It was Shannon's city.
- Vox → Vocals; Kontusion and Nuclear Tomb added to the shared-stage list;
  JSON-LD `album` now lists both releases instead of only the singles.

---

## Next up

1. **Homepage hook line.** One sentence — genre, city, a reason to stay — above
   the embeds. The homepage is still the weakest page for a stranger landing
   cold. ~1 hour.
2. **Put *From Man To Mist: Remisted* on Bandcamp.** It's on every other
   platform but not there — which is the one both `/about` and `/press` link to
   as "Discography," and the best-margin place a metal fan can buy it. The
   `/about` copy names a record with no findable home until this is done.
   Do it before pointing any press at the catalog.
3. **Fix the EPK PDF at source** (`design-assets/maldeveraEPK.pdf`, gitignored).
   Four things now diverge from it. It says "Forged in 2010" (it's 2011), prints
   "6.9 ASHVILLE, NC" for what was actually Raleigh, lists no members at all,
   and calls the band Dallas *and* New Orleans, which stopped being true when
   Shannon left. The web page corrects all four; the downloadable PDF doesn't.
4. **New band photos.** Blocks the album rollout, not just the site. Stephan's
   card on `/about` is a phone snapshot standing in, `/press` has no lineup
   photo at all, and the About header shot is the old lineup. Every outlet,
   promoter and playlist curator asks for a current press photo as the first
   thing, and pitching starts months before release. One shoot fixes the About
   header, all four member cards, the EPK and the press assets.

## Parked by choice

- **Email capture.** The biggest remaining gap. Nothing on the site converts a
  visitor into someone reachable later, so every show evaporates. Resend is
  already wired for transactional mail, so the sending half exists. ~half a day.
- **About page interactive band photo.** Two options, undecided: clickable
  glowing hotspots over each head, or 3D models per member with the bassist
  blacked out as a mystery character. Hotspots are the safe build; the 3D
  version is the one people would share. Pick one before starting either.

## Site plumbing

- **Prerendering.** Would give each page its own link preview (a flyer on a show
  link, a shirt on a merch link) and make the site readable to crawlers other
  than Google, which is the biggest remaining SEO limit. Touches the build.
- **Per-show URLs**, so a promoter can link one date. Also a prerequisite for
  per-show previews.
- **Flyer image weight** — 25 MB, rendered eagerly. See `SHOWS_TODO.md`.
- **Stage plot / input list** on the press kit. Standard venue ask.
- **522 MB of WAV masters in git.** Still makes every clone enormous. Untracking
  them changes how the repo works, so it's a deliberate call.

---

## Gotchas

- **Leave Cloudflare "Auto Install" OFF.** The analytics beacon is a tag in
  `frontend/public/index.html`. Auto Install injects the same script at the
  edge; both together silently double every page view.
- **Read analytics at the account level** in Cloudflare — Analytics & Logs →
  Web Analytics — *not* inside the maldevera.com zone, which is a different
  report that counts bots.
- **`design-assets/` is gitignored.** The EPK master and the full-res logo live
  there on purpose; don't commit them.
- **The tour flyer and the shows data disagree** in places. The flyer lists
  stops that aren't in the about list (Philly, Cleveland, two TBAs) and spells
  the NC date as Asheville when the show was Raleigh. `Shows.js` is the source
  of truth — it feeds the event structured data.
