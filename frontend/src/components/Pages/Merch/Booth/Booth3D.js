import React, { useCallback, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import BoothStructure from './BoothStructure';
import BoothItem from './BoothItem';
import BoothNote from './BoothNote';
import BoothNPC from './BoothNPC';
import WalkControls from './WalkControls';
import useBoothLayout from './useBoothLayout';

// The 3D scene. Desktop = first-person walk (pointer-lock + WASD); phones =
// drag-to-orbit. Theme + inventory flow in as props.
export default function Booth3D({
    products, theme, reducedMotion, isMobile, onSelect,
    walkMode, paused, onLockChange,
    talking, onTalk, onTalkEnd,
}) {
    const { rackItems, tableItems } = useBoothLayout(products);

    // Registry of pickable meshes for the walk-mode reticle raycaster.
    const meshesRef = useRef([]);
    const [hoveredId, setHoveredId] = useState(null);
    const registerMesh = useCallback((mesh) => {
        meshesRef.current.push(mesh);
        return () => { meshesRef.current = meshesRef.current.filter((m) => m !== mesh); };
    }, []);
    const handleHover = useCallback((id) => setHoveredId(id), []);

    const itemProps = (placement) => ({ theme, reducedMotion, onSelect, walkMode, hoveredId, registerMesh });

    return (
        <Canvas
            dpr={isMobile ? [1, 1.25] : [1, 1.5]}
            camera={{ fov: 55, position: walkMode ? [0, 1.6, 7] : [2.4, 3.2, 8.4], near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: false, toneMapping: THREE.NoToneMapping }}
            onCreated={({ gl }) => gl.setClearColor(new THREE.Color(theme.bg), 1)}
        >
            <color attach="background" args={[theme.bg]} />
            {/* the far end of the room fades into the dark rather than ending */}
            <fog attach="fog" args={[theme.fog, 16, 44]} />

            <BoothStructure theme={theme} />
            <BoothNote theme={theme} walkMode={walkMode} hoveredId={hoveredId} registerMesh={registerMesh} />
            <BoothNPC
                theme={theme}
                walkMode={walkMode}
                hoveredId={hoveredId}
                registerMesh={registerMesh}
                onTalk={onTalk}
            />

            {rackItems.map(({ product, position }) => (
                <BoothItem key={product.id} product={product} position={position} placement="rack" {...itemProps('rack')} />
            ))}
            {tableItems.map(({ product, position }) => (
                <BoothItem key={product.id} product={product} position={position} placement="table" {...itemProps('table')} />
            ))}

            {walkMode ? (
                <WalkControls
                    meshesRef={meshesRef}
                    onHover={handleHover}
                    onSelect={onSelect}
                    onLockChange={onLockChange}
                    paused={paused}
                    talking={talking}
                    onTalk={onTalk}
                    onTalkEnd={onTalkEnd}
                />
            ) : (
                <OrbitControls
                    makeDefault
                    enablePan
                    screenSpacePanning
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={3.2}
                    maxDistance={16}
                    minPolarAngle={Math.PI * 0.2}
                    maxPolarAngle={Math.PI * 0.54}
                    target={[0, 2.5, 0]}
                    autoRotate={!reducedMotion}
                    autoRotateSpeed={0.4}
                />
            )}
        </Canvas>
    );
}
