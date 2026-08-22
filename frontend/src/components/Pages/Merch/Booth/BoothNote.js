import React, { useEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const LINK = 'https://www.youtube.com/watch?v=0NtLrMk7SGg&list=RD0NtLrMk7SGg';
export const NOTE_ID = '__note__';

// The cryptic note stuck to the BACK of the table — found by walking behind.
// Clicking it (or reticle + E in walk mode) opens a little payoff in a new tab.
function makeNoteTexture(theme) {
    const s = 256;
    const canvas = document.createElement('canvas');
    canvas.width = s; canvas.height = s;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e9e3c6';           // aged paper
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';  // curled corner shadow
    ctx.beginPath(); ctx.moveTo(s - 46, 0); ctx.lineTo(s, 0); ctx.lineTo(s, 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5a1410';           // dried, rust-dark ink
    ctx.textAlign = 'center';
    const mono = theme.display === 'mono';
    ctx.font = `italic 600 26px ${mono ? '"Courier New", monospace' : 'Georgia, serif'}`;
    const lines = ['go spend', 'money.', 'get out', 'of here.', 'go back', 'over there', 'and buy', 'something.'];
    ctx.save(); ctx.translate(s / 2, 40); ctx.rotate(-0.045);
    lines.forEach((ln, i) => ctx.fillText(ln, 0, i * 27));
    ctx.restore();
    // the trap
    ctx.save(); ctx.translate(s / 2, 250); ctx.rotate(-0.045);
    ctx.font = `italic 700 22px ${mono ? '"Courier New", monospace' : 'Georgia, serif'}`;
    ctx.fillText("don't press e", 0, 0);
    ctx.restore();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

export default function BoothNote({ theme, walkMode, hoveredId, registerMesh }) {
    const meshRef = useRef();
    const tex = useMemo(() => makeNoteTexture(theme), [theme]);
    const openLink = () => window.open(LINK, '_blank', 'noopener,noreferrer');

    // Register with the walk-mode reticle raycaster as a "link" interactable.
    useEffect(() => {
        if (!walkMode || !meshRef.current || !registerMesh) return;
        const m = meshRef.current;
        m.userData.kind = 'link';
        m.userData.url = LINK;
        m.userData.id = NOTE_ID;
        return registerMesh(m);
    }, [walkMode, registerMesh]);

    const hovered = walkMode && hoveredId === NOTE_ID;
    const pointerProps = walkMode ? {} : {
        onPointerOver: (e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; },
        onPointerOut: () => { document.body.style.cursor = 'auto'; },
        onClick: (e) => { e.stopPropagation(); openLink(); },
    };

    return (
        <group position={[1.7, 1.35, -0.99]} rotation={[0, Math.PI, 0.03]}>
            <mesh ref={meshRef} {...pointerProps}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshStandardMaterial map={tex} roughness={0.95} side={THREE.FrontSide} />
            </mesh>
            {hovered && (
                <Html center position={[0, -0.33, 0.03]} pointerEvents="none" zIndexRange={[20, 0]}>
                    <div className="booth-press">press E</div>
                </Html>
            )}
        </group>
    );
}
