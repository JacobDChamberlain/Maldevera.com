# Booth models

Drop a `.glb` here named **`booth-npc.glb`** and it becomes the figure standing
at the back of the merch-booth room (`/merch`, walk mode).

- Any scale or units work — the model is auto-fitted to ~1.85 units tall with
  its feet on the floor and centered on its own footprint.
- Face the model forward along +Z if you can; it gets turned to look back at
  the booth. If yours ends up facing the wrong way, flip the `rotation` on the
  group in `frontend/src/components/Pages/Merch/Booth/BoothNPC.js`.
- Animations are ignored — it just stands there.
- Keep it reasonably light (a few MB); it's fetched when the booth loads.

With no file here, a plain dark silhouette stands in its place so the
conversation still works.
