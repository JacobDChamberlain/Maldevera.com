import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import * as boothAudio from './boothAudio';
import { BOUNDS, NPC } from './boothSpace';

const SPEED = 6.5;         // walk speed (units/sec)
const STAND_EYE = 2.15;    // standing eye height (above the feet)
const CROUCH_EYE = 1.25;   // crouched eye height (Shift)
const JUMP_V = 6.4;        // jump launch velocity (apex ~1.35 — clears the table)
const GRAVITY = 15;        // gravity for the jump arc
const STEP_INTERVAL = 0.4; // seconds between footstep sounds while moving

// The merch table: a solid you can jump ONTO (top at y=1.0) but not walk through.
const TABLE = { xHalf: 4.5, zMin: -0.95, zMax: 1.65, top: 1.0 };
// The grid-wall rack sits at this z; you can never pass front<->back through it
// (walk around the ends), even while standing on the table.
const RACK_Z = -0.85;
const RACK_XHALF = 4.7;
const groundAt = (x, z) =>
    (Math.abs(x) < TABLE.xHalf && z > TABLE.zMin && z < TABLE.zMax) ? TABLE.top : 0;
const inTable = (x, z) =>
    Math.abs(x) < TABLE.xHalf && z > TABLE.zMin && z < TABLE.zMax;
const crossesRack = (fromZ, toZ, x) =>
    Math.abs(x) < RACK_XHALF && ((fromZ > RACK_Z) !== (toZ > RACK_Z));
// The stranger is solid too — you stop at him instead of walking through.
const inNpc = (x, z) => Math.hypot(x - NPC.x, z - NPC.z) < NPC.radius;

// First-person controller: pointer-lock mouse look + WASD/arrow movement, with
// a center reticle that raycasts for the item you're looking at. Desktop only.
export default function WalkControls({
    meshesRef, onHover, onSelect, onLockChange, paused,
    talking, onTalk, onTalkEnd,
}) {
    const { camera } = useThree();
    const controlsRef = useRef();
    const keys = useRef({});
    const locked = useRef(false);
    const hoveredRef = useRef(null);
    const raycaster = useRef(new THREE.Raycaster());
    const dir = useRef(new THREE.Vector3());
    const right = useRef(new THREE.Vector3());
    const move = useRef(new THREE.Vector3());
    const stepAcc = useRef(0);
    const vy = useRef(0);          // vertical velocity
    const feetY = useRef(0);       // height of the player's feet (0 = floor, 1 = on table)
    const grounded = useRef(true);
    const eyeOff = useRef(STAND_EYE); // eye height above feet (lerps for crouch)
    const resumeLock = useRef(false);

    useEffect(() => {
        camera.position.set(0, STAND_EYE, 7);
        camera.lookAt(0, STAND_EYE, 0);
    }, [camera]);

    // Opening a detail panel releases the mouse (so you can use the panel);
    // closing it drops you straight back into the game — no re-click needed.
    useEffect(() => {
        const c = controlsRef.current;
        if (!c) return;
        if (paused) {
            if (locked.current) { resumeLock.current = true; c.unlock(); }
        } else if (resumeLock.current) {
            resumeLock.current = false;
            // requestPointerLock may reject if outside the activation window;
            // if so the "Enter the booth" overlay is still there as a fallback.
            try { const r = c.lock(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* noop */ }
        }
    }, [paused]);

    useEffect(() => {
        const activate = (u) => {
            if (!u) return;
            if (u.kind === 'product') onSelect(u.product);
            else if (u.kind === 'npc') onTalk();
            else if (u.kind === 'link') window.open(u.url, '_blank', 'noopener,noreferrer');
        };
        const down = (e) => {
            keys.current[e.code] = true;
            // Stop Space / arrows from scrolling the page while you're walking.
            if (locked.current && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            // While a conversation is up, E belongs to the dialogue box.
            if (e.code === 'KeyE' && locked.current && !paused && !talking) activate(hoveredRef.current);
        };
        const up = (e) => { keys.current[e.code] = false; };
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
    }, [onSelect, onTalk, paused, talking]);

    useEffect(() => {
        const c = controlsRef.current;
        if (!c) return;
        const onLock = () => { locked.current = true; onLockChange(true); boothAudio.resume(); };
        const onUnlock = () => { locked.current = false; onLockChange(false); keys.current = {}; };
        c.addEventListener('lock', onLock);
        c.addEventListener('unlock', onUnlock);
        return () => { c.removeEventListener('lock', onLock); c.removeEventListener('unlock', onUnlock); };
    }, [onLockChange]);

    // A click while locked activates whatever the reticle is on.
    useEffect(() => {
        const onClick = () => {
            const u = hoveredRef.current;
            if (!locked.current || paused || talking || !u) return;
            if (u.kind === 'product') onSelect(u.product);
            else if (u.kind === 'npc') onTalk();
            else if (u.kind === 'link') window.open(u.url, '_blank', 'noopener,noreferrer');
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [onSelect, onTalk, paused, talking]);

    useFrame((_, delta) => {
        if (!locked.current || paused) return;

        camera.getWorldDirection(dir.current);
        dir.current.y = 0;
        dir.current.normalize();
        right.current.crossVectors(dir.current, camera.up).normalize();

        const k = keys.current;
        const crouch = k['ShiftLeft'] || k['ShiftRight'];
        let mz = 0, mx = 0;
        if (k['KeyW'] || k['ArrowUp']) mz += 1;
        if (k['KeyS'] || k['ArrowDown']) mz -= 1;
        if (k['KeyD'] || k['ArrowRight']) mx += 1;
        if (k['KeyA'] || k['ArrowLeft']) mx -= 1;

        // horizontal movement (axis-separated so you slide along solids)
        if (mx || mz) {
            const speed = (crouch ? SPEED * 0.55 : SPEED) * Math.min(delta, 0.05);
            move.current.set(0, 0, 0);
            move.current.addScaledVector(dir.current, mz);
            move.current.addScaledVector(right.current, mx);
            move.current.normalize().multiplyScalar(speed);

            let nx = camera.position.x + move.current.x;
            let nz = camera.position.z + move.current.z;
            nx = Math.max(-BOUNDS.xHalf, Math.min(BOUNDS.xHalf, nx));
            nz = Math.max(BOUNDS.zMin, Math.min(BOUNDS.zMax, nz));

            // On the table you're above its body, so it stops blocking you.
            const onTableLevel = feetY.current >= TABLE.top - 0.1;
            const blocked = (x, z) => (!onTableLevel && inTable(x, z)) || inNpc(x, z);

            if (!blocked(nx, camera.position.z)) camera.position.x = nx;
            if (!blocked(camera.position.x, nz) && !crossesRack(camera.position.z, nz, camera.position.x)) {
                camera.position.z = nz;
            }

            if (grounded.current) {
                stepAcc.current += delta;
                if (stepAcc.current >= STEP_INTERVAL) { boothAudio.footstep(); stepAcc.current = 0; }
            }
        } else {
            stepAcc.current = STEP_INTERVAL;
        }

        // jump (Space) + gravity, landing on the floor OR the table top
        if (k['Space'] && grounded.current) { vy.current = JUMP_V; grounded.current = false; boothAudio.footstep(); }
        vy.current -= GRAVITY * delta;
        feetY.current += vy.current * delta;
        const ground = groundAt(camera.position.x, camera.position.z);
        if (feetY.current <= ground) { feetY.current = ground; vy.current = 0; grounded.current = true; }
        else { grounded.current = false; }

        // crouch (Shift): lerp the eye height for a smooth duck
        const targetEye = crouch ? CROUCH_EYE : STAND_EYE;
        eyeOff.current += (targetEye - eyeOff.current) * Math.min(1, delta * 12);
        camera.position.y = feetY.current + eyeOff.current;

        // Walk off and the stranger stops talking.
        if (talking && Math.hypot(camera.position.x - NPC.x, camera.position.z - NPC.z) > NPC.talkRange) {
            onTalkEnd();
        }

        // Reticle raycast from screen center.
        raycaster.current.setFromCamera({ x: 0, y: 0 }, camera);
        const meshes = meshesRef.current || [];
        const hit = raycaster.current.intersectObjects(meshes, false)[0];
        const data = hit && hit.distance < 6 ? hit.object.userData : null;
        const prevId = hoveredRef.current ? hoveredRef.current.id : null;
        const newId = data ? data.id : null;
        if (newId !== prevId) {
            hoveredRef.current = data;
            onHover(newId);
        }
    });

    return <PointerLockControls ref={controlsRef} selector="#booth-explore" />;
}
