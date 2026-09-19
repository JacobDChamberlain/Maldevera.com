# Shows Page TODO

Ideas and pending work for the shows page. Nothing here is started.

---

## Link band names to their socials

Make each band name on a show card clickable, going to their Instagram / Bandcamp / Facebook / website.

**The code is the easy part.** Bands are currently plain strings:

```js
bands: ['Mortalizer', 'Duskseeker']
```

They'd become objects, with the renderer falling back to plain text when there's no link:

```js
bands: [{ name: 'Mortalizer', url: 'https://...' }, 'Duskseeker']
```

**The data is the hard part.** As of this writing:

- **126 unique band names** across 45 shows (151 total band slots)
- **70 of those are a single word** — Void, Eternal, Phantom, Dungeon, Distain, Animus, Carnist, Disaster, Gator…

Single-word metal band names collide constantly. There are multiple active bands named "Void" and "Eternal". Guessing wrong means publishing a link to a stranger's Instagram on our site, which is worse than having no link at all.

Three entries aren't bands and must be skipped:

- `Festival` (×4) — placeholder for festival appearances
- `(side stage to Mortician)` — a note on the Sept 12 2026 entry, sitting in the bands array

**Approaches, roughly cheapest to best:**

1. **Search links, zero research.** Point each name at a Bandcamp or Google search for `"<band name>" metal`. Never wrong, never 404s, but it's a search page, not their profile. Could ship in an hour.
2. **Researched links, confidence-gated.** Look each band up, add a link only where the match is unambiguous (right city/scene, played the actual show), leave the rest as plain text. Best result, but needs a careful pass and someone to sanity-check the ambiguous ones.
3. **Upcoming shows only.** Just link bands on upcoming shows — a handful at a time, added as shows are announced, while the promoter's posts are still at hand to confirm identity. Least work per show and the accuracy problem mostly disappears.

Option 3 is probably the right default, with option 1 as a fallback for the back catalogue.

---

## Link venues to their website / socials

Same idea, much more tractable: **24 unique venues**, nearly all established rooms with an obvious web presence. Venue names are far less ambiguous than band names.

Would apply to the `@ Venue` line on the hero and the poster cards.

**Cleanup to fold in while doing this** — the venue list has duplicates that should be reconciled first:

- `Reno's Chop Shop` and `Renos` are the same venue, spelled two ways
- `Cheap Steaks` and `Dusty's` are the same address (2613 Elm St) — the room was renamed, so both spellings are correct for their own dates and should stay, but any venue→link map needs to handle that
- `The Lost Well` moved in 2024 (Webberville Rd → Airport Blvd), so its address varies by show date

A venue lookup keyed on name would be the natural place to put website, socials, and canonical address.

---

## Flyer image weight

See git history — a first pass compressed the Oct 29 2026 flyer from 11.4 MB to 487 KB (WebP, 2000px long edge). The rest of the folder still needs the same treatment, and the poster wall renders every flyer eagerly.
