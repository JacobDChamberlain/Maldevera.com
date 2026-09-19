# Booth models

`spencer.glb` is the figure standing at the back of the merch-booth room
(`/merch`, walk mode). He's wired up in
`src/components/Pages/Merch/Booth/BoothNPC.js` — swapping him out is just a
different filename in `MODEL_URL` there.

Any scale or orientation works: the model is auto-fitted to ~1.85 units tall,
centered on its own footprint, feet on the floor, and turned to face the booth
(a model that faces +Z comes out facing the player — flip the group's
`rotation` if yours ends up backwards). Animations are ignored; he just stands
there. With no file at that path, a plain dark silhouette stands in so the
conversation still works.

## Keep these small

The raw scan was 21.4 MB (2K normal + 2K base color + a 4K metallic-roughness,
all PNG). Shipped version is 2.27 MB, same texture resolution, via:

    npx @gltf-transform/cli optimize in.glb out.glb \
        --texture-size 2048 --texture-compress webp \
        --compress quantize --simplify false --join false

That needs `EXT_texture_webp` and `KHR_mesh_quantization`, both of which
three.js reads natively — no extra decoder files. Run anything new through the
same command before committing it; this folder ships to every visitor.
