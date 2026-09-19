import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { ROOM } from './boothSpace';

const LOGO_URL = '/images/Maldevera_logo-BONE_TEXTURE.webp';

// Builds the banner image on a canvas so the text picks up the theme colors/font.
function makeBannerTexture(theme) {
    const w = 1024, h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const mono = theme.display === 'mono';

    ctx.fillStyle = theme.bannerBg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = theme.bannerAccent;
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, w - 6, h - 6);

    // The band name is the big logo up top; this rectangular sign just holds
    // "merch booth" in a retro cursive, centered.
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.bannerText;
    ctx.font = `italic 700 128px ${mono ? '"Courier New", monospace' : '"Brush Script MT", "Snell Roundhand", "Segoe Script", cursive'}`;
    ctx.fillText('merch booth', w / 2, h / 2 + 6);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

// A grid-wall panel (the wire grids shirts hang from at real merch booths).
// One shared material + coarser cells keep the draw cost down.
function GridWall({ theme, width = 9, height = 3.1, yBottom = 1.0, z = -0.85, cell = 0.5 }) {
    const barMat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: theme.trim, metalness: 0.5, roughness: 0.5 }),
        [theme]
    );
    const verticals = [];
    for (let x = -width / 2; x <= width / 2 + 1e-6; x += cell) verticals.push(x);
    const horizontals = [];
    for (let y = yBottom; y <= yBottom + height + 1e-6; y += cell) horizontals.push(y);

    return (
        <group>
            {verticals.map((x, i) => (
                <mesh key={`v${i}`} position={[x, yBottom + height / 2, z]} material={barMat}>
                    <boxGeometry args={[0.02, height, 0.02]} />
                </mesh>
            ))}
            {horizontals.map((y, i) => (
                <mesh key={`h${i}`} position={[0, y, z]} material={barMat}>
                    <boxGeometry args={[width, 0.02, 0.02]} />
                </mesh>
            ))}
        </group>
    );
}

export default function BoothStructure({ theme }) {
    const bannerTex = useMemo(() => makeBannerTexture(theme), [theme]);

    // The real site logo, loaded as a texture for the banner.
    const [logoTex, setLogoTex] = useState(null);
    useEffect(() => {
        let alive = true;
        new THREE.TextureLoader().load(LOGO_URL, (t) => {
            if (!alive) return;
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 4;
            setLogoTex(t);
        });
        return () => { alive = false; };
    }, []);
    const logoAspect = logoTex && logoTex.image ? logoTex.image.width / logoTex.image.height : 3.2;
    const logoW = 9;                 // as wide as the booth
    const logoH = logoW / logoAspect;
    const logoY = 4.05 + logoH / 2;  // bottom just overhanging the rack top (~4.1)
    const poleMat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: theme.trim, metalness: 0.6, roughness: 0.4 }),
        [theme]
    );

    return (
        <group>
            {/* floor — spans the whole room, well past the walls */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (ROOM.zBooth + ROOM.zRear) / 2]}>
                <planeGeometry args={[ROOM.xHalf * 4, (ROOM.zRear - ROOM.zBooth) * 2]} />
                <meshStandardMaterial color={theme.floor} roughness={0.95} />
            </mesh>

            {/* wall behind the booth */}
            <mesh position={[0, ROOM.height / 2, ROOM.zBooth]}>
                <planeGeometry args={[ROOM.xHalf * 2.4, ROOM.height]} />
                <meshStandardMaterial color={theme.wall} roughness={1} />
            </mesh>

            {/* the room carrying on behind the player: side walls + a far wall,
                so walking away from the booth reads as a long dark venue
                rather than an open void */}
            {[-1, 1].map((side) => (
                <mesh
                    key={`side${side}`}
                    position={[side * ROOM.xHalf, ROOM.height / 2, (ROOM.zBooth + ROOM.zRear) / 2]}
                    rotation={[0, -side * Math.PI / 2, 0]}
                >
                    <planeGeometry args={[ROOM.zRear - ROOM.zBooth, ROOM.height]} />
                    <meshStandardMaterial color={theme.wall} roughness={1} side={THREE.DoubleSide} />
                </mesh>
            ))}
            <mesh position={[0, ROOM.height / 2, ROOM.zRear]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[ROOM.xHalf * 2, ROOM.height]} />
                <meshStandardMaterial color={theme.wall} roughness={1} />
            </mesh>

            {/* merch table: dark body + a lit cloth top so it clearly reads as a table */}
            <mesh position={[0, 0.5, 0.35]}>
                <boxGeometry args={[9, 1.0, 2.6]} />
                <meshStandardMaterial color={theme.table} roughness={0.85} />
            </mesh>
            <mesh position={[0, 1.02, 0.35]}>
                <boxGeometry args={[9.3, 0.08, 2.9]} />
                <meshStandardMaterial
                    color={theme.tableTop}
                    roughness={0.7}
                    emissive={theme.accent}
                    emissiveIntensity={0.18}
                />
            </mesh>
            {/* front skirt with a glowing accent hem */}
            <mesh position={[0, 0.5, 1.66]}>
                <boxGeometry args={[9.3, 1.0, 0.04]} />
                <meshStandardMaterial color={theme.table} roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.0, 1.68]}>
                <boxGeometry args={[9.3, 0.05, 0.04]} />
                <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={0.6} />
            </mesh>

            <GridWall theme={theme} />

            {/* truss holding the big logo above the rack */}
            {[-4.5, 4.5].map((x, i) => (
                <mesh key={`pole${i}`} position={[x, (logoY + logoH / 2 + 0.2) / 2, -0.9]} material={poleMat}>
                    <cylinderGeometry args={[0.06, 0.06, logoY + logoH / 2 + 0.2, 12]} />
                </mesh>
            ))}
            <mesh position={[0, logoY + logoH / 2 + 0.15, -0.9]} rotation={[0, 0, Math.PI / 2]} material={poleMat}>
                <cylinderGeometry args={[0.06, 0.06, 9.1, 12]} />
            </mesh>

            {/* rectangular "merch booth" sign — behind the logo (backmost) */}
            <mesh position={[0, 4.55, -0.88]}>
                <planeGeometry args={[3.8, 0.95]} />
                <meshBasicMaterial map={bannerTex} transparent />
            </mesh>

            {/* big site logo — booth-wide, above the rack, in FRONT of the sign
                (shirts at z ≈ -0.7 still render in front of both) */}
            {logoTex && (
                <mesh position={[0, logoY, -0.8]}>
                    <planeGeometry args={[logoW, logoH]} />
                    <meshBasicMaterial map={logoTex} transparent toneMapped={false} />
                </mesh>
            )}

            {/* lighting — venue stays dark, the booth itself is lit bright */}
            <ambientLight color={0xffffff} intensity={1.4} />
            <ambientLight color={theme.ambient} intensity={1.4} />
            <spotLight
                color={theme.spot}
                intensity={4.5}
                position={[0, 9, 5]}
                angle={0.85}
                penumbra={0.5}
                distance={45}
                target-position={[0, 1.5, 0.3]}
            />
            <directionalLight color={0xffffff} intensity={1.1} position={[0, 5, 10]} />
            <pointLight color={theme.accent} intensity={0.8} distance={24} position={[-5, 3.5, 0]} />
        </group>
    );
}
