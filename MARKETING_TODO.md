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

---

## Next up

1. **Submit the sitemap to Google Search Console.** ~15 min. Verify the domain,
   submit `https://maldevera.com/sitemap.xml`. None of the search work above
   pays off until Google is actually looking.
2. **Homepage hook line.** One sentence — genre, city, a reason to stay — above
   the embeds. The homepage is still the weakest page for a stranger landing
   cold. ~1 hour.
3. **Members back on `/press`** with instruments: Parker and Jacob guitars/vox,
   Keith bass, Shannon drums. They came off when the page was rebuilt from the
   EPK, which lists no members. ~10 min.
4. **Fix the EPK PDF at source** (`design-assets/maldeveraEPK.pdf`, gitignored).
   It says "Forged in 2010" (it's 2011) and prints "6.9 ASHVILLE, NC" for what
   was actually Raleigh. The web page corrects both; the downloadable PDF
   doesn't.

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
