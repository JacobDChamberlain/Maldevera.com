# Merch Booth — Next Round

Working doc for the `merch-shop-ideas` branch. Nothing here is started; this is
the reference for what we're building and what each piece actually touches.

Branched from `main` at `5b2bd4f` (includes PR #121, the size-ordering fix).

---

## Where the booth is today

Worth writing down, because several of these ideas are "change the default"
rather than "build a thing."

- `/merch` renders `MerchBooth`, which picks between the 3D booth and the
  classic `MerchGrid`. **Booth is currently the default**; the choice persists
  in `localStorage['merch-view']`. No WebGL forces grid.
- **Desktop = first-person walk.** `WalkControls` does pointer-lock look, WASD /
  arrows, Shift to crouch, Space to jump (you can land on the table), a center
  reticle, and E to interact. Collision exists for the table, the grid-wall
  rack, and the NPC.
- **Mobile = orbit only.** `walkMode = showBooth && !isMobile`, so phones get
  `OrbitControls` (drag / pinch / pan) plus a one-line hint. You cannot walk on
  a phone today.
- **Room:** booth at the origin facing +z, player spawns at z=7. Table spans
  x ±4.5, z -0.95→1.65, top at y=1.0. Grid-wall rack at z=-0.85, top y=4.1.
  Wall behind the booth at z=-3.4; the venue runs back to z=30. Walkable box is
  x ±11.8, z -6→28.8. (`boothSpace.js`, `BoothStructure.js`, `WalkControls.js`)
- **Spencer** (`/models/spencer.glb`, 2.27 MB) stands at z=24, at the far back.
  He's a photogrammetry scan, no animation — `useNpcModel` deliberately ignores
  animation clips. One typed-out bark per visit (`BoothDialogue.js`).
- **Audio** is synthesized Web Audio only — footsteps, pickup/putdown blips, a
  garble-per-character voice. No audio files, no music. (`boothAudio.js`)

---

## 1. Grid becomes the default

**Done** — e563ab1/687434b.

Flip the default so `/merch` opens as the familiar shop and the booth is
something you choose.

- One-line change to the `useState` initializer in `MerchBooth.js`.
- **Wrinkle:** anyone who has already visited has `merch-view` set in
  localStorage and will keep landing in the booth. If we want the new default to
  apply to everyone, bump the key (`merch-view-2`) or clear the old one.
- The "Enter the booth" toggle becomes the front door, so it should stop looking
  like a small utility button in the corner — give it some weight on the grid
  page, probably near the top with a line of copy about what it is.

## 2. Clearer controls and directions

**Done** — 687434b.

The controls we actually support are ahead of what we tell people.

- The desktop overlay currently says only *"WASD / arrows to walk · mouse to
  look · Esc to release"*. It never mentions **E to interact**, **Space to
  jump**, or **Shift to crouch** — all of which work.
- Mobile gets no entry overlay at all, just `.booth-hint` at the bottom.
- Plan: one shared entry card that both platforms get, listing the real control
  set for that device, and a persistent, dismissible control legend in a corner
  while you're in there (rather than a hint that only shows before you start).
- Keep the entry card as the pointer-lock trigger on desktop — `WalkControls`
  matches clicks on `#booth-explore` and the lock must come from a user gesture,
  so whatever we build has to keep that id (or the matcher moves with it).

## 3. Fullscreen

Offer fullscreen from the same card that shows the directions — the spot the ▶
button occupies now. Entering the booth and going fullscreen become one gesture,
with a plain "Enter the booth" fallback for anyone who'd rather not.

**Platform reality, because this is the part that bites:**

- Desktop + Android Chrome: `element.requestFullscreen()` on `.booth-stage`
  works fine.
- **iOS Safari on iPhone has no Fullscreen API for regular elements** — only
  `<video>`. So on iPhone "fullscreen" has to be faked: a `position: fixed`
  overlay at `100dvh` with the page behind it locked from scrolling. Good news
  is `.booth-stage` is already `100dvh`.
- Need an explicit exit affordance on mobile, since there's no Esc.

## 4. Landscape on mobile

When the booth goes fullscreen on a phone, ask for landscape.

- `screen.orientation.lock('landscape')` only works **while fullscreen**, and is
  **not supported on iOS at all**.
- So: attempt the lock where it exists, and everywhere else show a "turn your
  phone sideways" prompt that clears itself once
  `matchMedia('(orientation: landscape)')` matches. The prompt is the real
  implementation; the lock is a bonus on Android.

## 5. Touch joystick — walking on mobile

The biggest build of the five. Landscape fullscreen is what makes room for it.

- Today `walkMode` is hard-gated off for touch. The work is splitting
  `WalkControls` into its movement/collision/interaction core (shared) and its
  input layer (pointer-lock mouse look vs. touch).
- Touch layer: left-thumb virtual joystick for movement, drag anywhere on the
  right half to look, tap an item to select. The reticle + E model doesn't
  translate — on touch it should be tap-to-open, the way orbit mode already
  works.
- Everything else in the controller is input-agnostic and carries over as-is:
  gravity, jump, the table/rack/NPC collision, footstep timing, the talk-range
  check.
- Keep orbit mode as the non-fullscreen / portrait mobile experience. Walking
  shouldn't be the only way in on a phone.

## 6. Background music in the booth

- `boothAudio.js` is pure synthesis right now, so this adds the first real audio
  file to the booth. It already exposes `resume()`, and the AudioContext is
  already resumed on a user gesture — entering the booth is that gesture, so
  autoplay policy is handled.
- Needs a visible mute/volume control, remembered across visits. Music that
  starts on its own with no obvious off switch is the thing people hate.
- **Source question for you:** there are seven track mp3s sitting uncommitted in
  `frontend/src/components/Footer/audio/` from the player work. Is one of those
  the booth music, or do you want something separate and loopable? A full track
  is a big download for a page people might bounce off — a short loop or a
  compressed low-bitrate cut would be kinder.
- Should it duck when the minotaur talks? Probably yes.

## 7. Jeff the Minotaur, behind the counter

A Meshy asset with real animation, working the booth.

**Placement — flagging my assumption:** "behind the booth" reads to me as
*behind the counter*, i.e. the merch guy, around z ≈ -2 (between the rack at
z=-0.85 and the back wall at z=-3.4), facing the player. That also fits
Spencer's whole bit — he literally says *"i'm not the merch guy. i just stand
here."* So Spencer stays where he is at z=24 and Jeff runs the table.

**Confirmed:** Spencer stays awkwardly off in the background, found only by
people who wander back there. He's not to be made easier to find.

- **Animations: idle, excited (on add-to-cart), talking.** This is new
  machinery — `useNpcModel` currently discards `gltf.animations` entirely. Needs
  an `AnimationMixer` driven by `useFrame`, with crossfades between clips and a
  state that returns to idle. Cleanest as a new hook so `BoothNPC` can keep its
  simple path.
- The add-to-cart trigger has to reach him from `ProductDetail` /
  `useProductPurchase`, which is where the cart action actually fires.
- **Scale:** `NPC.height` is 1.85, a human. A minotaur should read bigger —
  ~2.3–2.5 — so the height and the collider both need to be per-character
  rather than the single shared `NPC` constant.
- `boothSpace.js` has exactly one `NPC` block and `WalkControls.inNpc()` checks
  exactly one circle. Both want generalizing to a list before a second character
  exists.
- Dialogue: `BoothDialogue` takes a `text` prop and defaults to Spencer's pools,
  so Jeff can reuse the component with his own lines and name. He needs his own
  voice — he's the one who wants you to buy something, where Spencer just wants
  you to go away.

### Making room for him

He goes behind the counter, in front of the sign and the shirt wall. There is
currently **no gap to stand in**: the table spans z -0.95→1.65 and the grid-wall
rack is at z=-0.85, i.e. the rack sits inside the table's own depth. Two moves
open it up.

**Scoot the table forward.** Move it +1.6 in z (center 0.35 → 1.95, spanning
0.65→3.25) while the rack, sign and logo stay put. That leaves a 1.5-deep
standing gap between the rack and the back of the table. Jeff stands around
z=-0.15 facing +z: at a ~0.6 radius he spans -0.75→0.45, clear of the rack
behind him and the table in front. The player spawns at z=7, so there's still
plenty of approach room.

**Split the shirts outward.** He'd be standing behind a solid wall of hanging
shirts otherwise — the rack row is at y=1.95 and he's ~2.4 tall, so they'd cross
him right at the chest. `useBoothLayout` currently spreads the rack across one
centered span; it needs a left/right split with a center gap of ~3.4 (x ±1.7)
for him to read against the sign. Second-row wrapping has to respect the gap
too.

Note the side gaps between the table ends (x ±4.5) and the walls stay walkable,
so players can wander behind the counter and bump into him. That's fine — he
needs a collider anyway, and it's funnier that way.

**Watch out: the table is hardcoded in two files.** `BoothStructure.js` draws it
from literal `boxGeometry` args and `WalkControls.js` re-declares the same
numbers as `TABLE`/`RACK_Z`/`RACK_XHALF` for collision. Move the booth in one
and not the other and you get an invisible wall in open floor. These should move
into `boothSpace.js` as shared constants *before* anything gets scooted.

## 8. Galaga cabinet

A Meshy arcade cabinet to the player's right of the booth.

- Facing the booth from the spawn, the player's right is **+x**. The tabletop
  ends at x=4.65 and the walkable bound is x=11.8, so there's clear floor —
  something like x ≈ 6.8, z ≈ 0.4, turned to face +z.
- Needs a collision box in `WalkControls` alongside the table and rack, or you
  walk straight through it.
- Its own accent light; the venue is dark out there and a dead cabinet in shadow
  reads as a crate.
**Decided: inactive first, interactive later.** Ships as set dressing with a
glowing attract-mode screen, then becomes playable in its own phase.

- The game is a **Galaga clone** — canvas-rendered, drawn to a `CanvasTexture`
  on the cabinet screen, the same trick the "merch booth" banner already uses.
- Parked alternative: Galaga but the ship is Jacob's face, switching to a
  mouth-open frame when it fires. Funnier, weirder, and not the first version.
- Playing it means a camera lock to the cabinet plus its own input handling,
  which is why it's last.

---

## Asset pipeline (both Meshy models)

`public/models/README.md` already documents this and it applies to anything new:

    npx @gltf-transform/cli optimize in.glb out.glb \
        --texture-size 2048 --texture-compress webp \
        --compress quantize --simplify false --join false

The raw Spencer scan was 21.4 MB and shipped at 2.27 MB through that. **Every
file in that folder downloads for every booth visitor**, so both new models go
through it before they're committed. Careful here — animated models can't take
`--join`, and over-simplifying a rigged mesh wrecks deformation.

Budget worth agreeing on up front: Jeff plus the cabinet should land under
~4 MB combined, or entering the booth on a phone gets rough.

## 9. Fix the "merch booth" sign under the band logo

**Done** — e563ab1.

It blinks, mostly doesn't show on desktop, is a bit better on mobile, and is
covered by the band logo. All of that is one bug with two halves, and the
numbers say it plainly.

**It's geometrically underneath the logo.** The logo texture is 1400x616
(aspect 2.27) drawn 9 units wide, so it's 3.96 tall centered at y=6.03 — it
spans **y 4.05 to 8.01, x ±4.5**. The sign is 3.8x0.95 at y=4.55 — it spans
**y 4.08 to 5.03, x ±1.9**. The sign sits entirely inside the bottom quarter of
the logo plane. It was positioned against an assumed 3.2 aspect ratio
(`logoAspect`'s fallback); the real image is taller than that, so the logo grew
down over it.

**The blinking is transparency sort order.** Both planes are
`meshBasicMaterial transparent` with three's default `depthWrite: true`, and
they're only 0.08 apart in z (sign -0.88, logo -0.80). Three sorts transparent
objects back-to-front by *distance to the centroid*, and because the logo is
much higher up (y=6.03 vs 4.55) that distance ordering flips depending on where
the camera is standing. Draw the sign first and it shows through the logo's
alpha; draw the logo first and its transparent pixels write depth at the nearer
z, so the sign fails the depth test and disappears. Walking around swaps which
happens — hence the blink, and hence desktop (eye height 2.15) behaving
differently from mobile orbit (target y=2.5).

**Fix has to address both halves:**

- Move it somewhere it isn't under the logo — above the logo on the truss, or
  down onto the table skirt, or out to one side. Its current spot is taken.
- `depthWrite={false}` plus explicit `renderOrder` on the sign and the logo, so
  the order stops depending on camera position. Worth doing even after they stop
  overlapping, since the rack bars and hanging shirts are nearby in z too.
- While we're in there: derive the sign's position from the *measured*
  `logoAspect` rather than hardcoded numbers, so it can't drift again if the
  logo art is ever swapped.

---

## Suggested order

1. **Fix the merch sign** — small, isolated, and it's visibly broken today.
2. **Grid default + clearer controls** — small, self-contained, immediately
   better, no new assets.
3. **Fullscreen + landscape prompt** — makes the mobile work possible.
4. **Touch joystick** — the real engineering; needs fullscreen in place first.
5. **Background music** — independent, drop in whenever the source is settled.
6. **Jeff + animation system** — the animation machinery is the new part.
7. **Galaga cabinet** — easiest of the 3D work, mostly placement and collision.

## Open questions

- Music source: one of the seven footer mp3s, or a dedicated loop?
