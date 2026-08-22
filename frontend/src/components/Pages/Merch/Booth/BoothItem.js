import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getProductMeta, priceLabel } from '../productMeta';

// Loads a product image as a texture with CORS enabled. Reports failure so the
// item can fall back to a plain board instead of throwing.
function useImageTexture(url) {
    const [state, setState] = useState({ tex: null, failed: false });
    useEffect(() => {
        if (!url) { setState({ tex: null, failed: true }); return; }
        let alive = true;
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(
            url,
            (tex) => {
                if (!alive) return;
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = 4;
                setState({ tex, failed: false });
            },
            undefined,
            () => { if (alive) setState({ tex: null, failed: true }); }
        );
        return () => { alive = false; };
    }, [url]);
    return state;
}

export default function BoothItem({
    product, position, placement, theme, reducedMotion, onSelect,
    // Walk mode drives hover from the central reticle raycaster instead of
    // per-mesh pointer events (which don't fire while the pointer is locked).
    walkMode = false, hoveredId = null, registerMesh,
}) {
    const groupRef = useRef();
    const meshRef = useRef();
    const [pointerHover, setPointerHover] = useState(false);
    const swayPhase = useMemo(() => Math.random() * Math.PI * 2, []);

    const meta = getProductMeta(product);
    // WebGL textures need CORS. R2 now serves the CORS header (with Vary: Origin),
    // but stale pre-CORS copies are cached at the edge — a versioned query escapes
    // them and fetches a fresh, CORS-enabled response. Plain <img> tags elsewhere
    // (grid, detail) don't need this since they display without CORS.
    const rawUrl = product.images && product.images[0];
    const texUrl = rawUrl ? rawUrl + (rawUrl.includes('?') ? '&' : '?') + 'wtex=1' : rawUrl;
    const { tex, failed } = useImageTexture(texUrl);

    const isRack = placement === 'rack';
    const maxDim = isRack ? 1.7 : 0.95;

    const [w, h] = useMemo(() => {
        if (tex && tex.image && tex.image.width) {
            const ar = tex.image.width / tex.image.height;
            return ar >= 1 ? [maxDim, maxDim / ar] : [maxDim * ar, maxDim];
        }
        return [maxDim * 0.8, maxDim];
    }, [tex, maxDim]);

    const hovered = walkMode ? hoveredId === product.id : pointerHover;

    // Register this mesh with the walk-mode raycaster so the reticle can hit it.
    useEffect(() => {
        if (!walkMode || !meshRef.current || !registerMesh) return;
        const m = meshRef.current;
        m.userData.kind = 'product';
        m.userData.product = product;
        m.userData.id = product.id;
        return registerMesh(m);
    }, [walkMode, registerMesh, product]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const base = isRack && !reducedMotion ? Math.sin(clock.elapsedTime * 0.8 + swayPhase) * 0.03 : 0;
        groupRef.current.rotation.z = base;
        groupRef.current.position.y = position[1] + (hovered ? 0.08 : 0);
        groupRef.current.scale.setScalar(hovered ? 1.06 : 1);
    });

    // Pointer handlers only in orbit mode; under pointer-lock they never fire.
    const pointerProps = walkMode ? {} : {
        onPointerOver: (e) => { e.stopPropagation(); setPointerHover(true); document.body.style.cursor = 'pointer'; },
        onPointerOut: () => { setPointerHover(false); document.body.style.cursor = 'auto'; },
        onClick: (e) => { e.stopPropagation(); onSelect(product); },
    };

    const tint = meta.isSoldOut ? '#777777' : (hovered ? '#ffffff' : '#e6e6e6');

    return (
        <group position={position}>
            {isRack ? (
                <mesh position={[0, h / 2 + 0.14, 0.02]}>
                    <torusGeometry args={[0.09, 0.012, 8, 20, Math.PI]} />
                    <meshStandardMaterial color={theme.trim} metalness={0.6} roughness={0.4} />
                </mesh>
            ) : (
                <mesh position={[0, -h / 2 + 0.03, 0.06]}>
                    <boxGeometry args={[Math.max(0.3, w * 0.7), 0.05, 0.16]} />
                    <meshStandardMaterial color={theme.trim} metalness={0.3} roughness={0.6} />
                </mesh>
            )}

            <group ref={groupRef}>
                <mesh
                    ref={meshRef}
                    {...pointerProps}
                    rotation={isRack ? [0, 0, 0] : [-0.12, 0, 0]}
                >
                    <planeGeometry args={[w, h]} />
                    {tex && !failed ? (
                        <meshBasicMaterial
                            map={tex}
                            transparent
                            alphaTest={0.5}
                            side={THREE.DoubleSide}
                            color={tint}
                            toneMapped={false}
                        />
                    ) : (
                        <meshStandardMaterial
                            color={theme.tableTop}
                            side={THREE.DoubleSide}
                            roughness={0.9}
                            emissive={theme.accent}
                            emissiveIntensity={hovered ? 0.4 : 0.15}
                        />
                    )}
                </mesh>

                {failed && (
                    <Html center distanceFactor={8} position={[0, 0, 0.02]} pointerEvents="none">
                        <div className="booth-fallback-label">{product.name}</div>
                    </Html>
                )}

                {/* Walk mode: "press E" just below the item's bottom edge. */}
                {hovered && walkMode && (
                    <Html center position={[0, -h / 2 - 0.1, 0.05]} pointerEvents="none" zIndexRange={[20, 0]}>
                        <div className="booth-press">press E</div>
                    </Html>
                )}
            </group>

            {/* Orbit/mobile: name+price popup above the item. */}
            {hovered && !walkMode && (
                <Html center distanceFactor={9} position={[0, h / 2 + 0.45, 0]} pointerEvents="none">
                    <div className="booth-tooltip">
                        <div className="booth-tooltip-name">{product.name}</div>
                        <div className="booth-tooltip-price">
                            {priceLabel(meta)}{meta.isSoldOut ? ' · sold out' : ''}
                        </div>
                    </div>
                </Html>
            )}

        </group>
    );
}
