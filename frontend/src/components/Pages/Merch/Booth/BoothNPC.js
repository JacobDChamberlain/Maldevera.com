import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { NPC } from './boothSpace';

// Spencer: a photogrammetry scan, squared up in a fighting stance. Swapping him
// out is just a different file here — any scale or orientation works, the model
// is auto-fitted to NPC.height with its feet on the floor.
const MODEL_URL = '/models/spencer.glb';
export const NPC_ID = '__npc__';

// Loads the GLB and normalizes it: scaled to `targetHeight`, centered on its
// own footprint, feet at y=0. Returns null until (or unless) it loads — a
// missing file just means the placeholder figure stays.
function useNpcModel(url, targetHeight) {
    const [scene, setScene] = useState(null);
    useEffect(() => {
        let alive = true;
        new GLTFLoader().load(
            url,
            (gltf) => {
                if (!alive) return;
                const root = gltf.scene;
                const box = new THREE.Box3().setFromObject(root);
                const size = box.getSize(new THREE.Vector3());
                if (size.y > 0) root.scale.setScalar(targetHeight / size.y);
                box.setFromObject(root);
                const center = box.getCenter(new THREE.Vector3());
                root.position.x -= center.x;
                root.position.z -= center.z;
                root.position.y -= box.min.y;
                setScene(root);
            },
            undefined,
            () => { /* no model dropped in yet — the placeholder stands in */ }
        );
        return () => { alive = false; };
    }, [url, targetHeight]);
    return scene;
}

// A plain dark silhouette, used until a .glb shows up at MODEL_URL.
function Placeholder({ theme }) {
    const mat = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: theme.wall,
            roughness: 0.9,
            emissive: theme.accent,
            emissiveIntensity: 0.08,
        }),
        [theme]
    );
    return (
        <group>
            <mesh position={[0, 0.62, 0]} material={mat}>
                <capsuleGeometry args={[0.26, 0.72, 4, 12]} />
            </mesh>
            <mesh position={[0, 1.52, 0]} material={mat}>
                <sphereGeometry args={[0.2, 16, 12]} />
            </mesh>
        </group>
    );
}

// The stranger at the back of the room. Reticle + E (or a click in orbit mode)
// starts the conversation; the text itself lives in BoothDialogue.
export default function BoothNPC({ theme, walkMode, hoveredId, registerMesh, onTalk }) {
    const colliderRef = useRef();
    const model = useNpcModel(MODEL_URL, NPC.height);

    useEffect(() => {
        if (!walkMode || !colliderRef.current || !registerMesh) return;
        const m = colliderRef.current;
        m.userData.kind = 'npc';
        m.userData.id = NPC_ID;
        return registerMesh(m);
    }, [walkMode, registerMesh]);

    const hovered = walkMode && hoveredId === NPC_ID;
    const pointerProps = walkMode ? {} : {
        onPointerOver: (e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; },
        onPointerOut: () => { document.body.style.cursor = 'auto'; },
        onClick: (e) => { e.stopPropagation(); onTalk(); },
    };

    return (
        // Turned to face the booth (and whoever walks up from it).
        <group position={[NPC.x, 0, NPC.z]} rotation={[0, Math.PI, 0]}>
            {model ? <primitive object={model} /> : <Placeholder theme={theme} />}

            {/* Invisible box the reticle/pointer actually hits, so the hit area
                doesn't depend on whatever geometry the GLB happens to have. */}
            <mesh ref={colliderRef} position={[0, NPC.height / 2, 0]} {...pointerProps}>
                <boxGeometry args={[1.1, NPC.height, 1.1]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {hovered && (
                <Html center position={[0, NPC.height + 0.3, 0]} pointerEvents="none" zIndexRange={[20, 0]}>
                    <div className="booth-press">press E</div>
                </Html>
            )}

            {/* Just enough light to pick him out of the dark as you approach. */}
            <pointLight color={theme.spot} intensity={12} distance={12} decay={2} position={[0, 2.4, 1.2]} />
        </group>
    );
}
