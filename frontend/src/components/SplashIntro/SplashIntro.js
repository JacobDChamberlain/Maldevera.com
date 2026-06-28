import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SplashIntro.css';

const LOGO_SRC = '/images/Maldevera_logo-BONE_TEXTURE.webp';
const SESSION_KEY = 'maldevera-splash-seen';

// Perceived timing budget (ms). Lightning double-strike lives inside the hold.
const PRE_MS = 350;      // black screen holds before the logo begins to appear
const ENTER_MS = 1000;   // logo fade + scale in
const HOLD_MS = 1700;    // logo holds while the lightning strikes invert it
const EXIT_MS = 700;     // overlay dissolves to reveal the site
// Total ~= PRE + ENTER + HOLD + EXIT = ~3.75s (reduced-motion: ~1.1s).

function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function alreadySeen() {
    try {
        return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (e) {
        return false;
    }
}

function markSeen() {
    try {
        sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {
        /* private mode / storage disabled — just play it this once */
    }
}

/**
 * First-visit "lights down before the set" intro.
 * - Renders nothing if already seen this session (return null).
 * - Overlays the already-rendered site (reveal, not gate) and dissolves away.
 * - Skippable via click / tap / scroll / key.
 * - Honors prefers-reduced-motion (quick fade, no flash/grain/scale).
 */
export default function SplashIntro() {
    // Lazy init so we never even mount the overlay for repeat visits.
    const [active, setActive] = useState(() => !alreadySeen());
    const [phase, setPhase] = useState('idle'); // idle -> entering -> holding -> exiting
    const reduced = useRef(prefersReducedMotion());
    const timers = useRef([]);
    const exitingRef = useRef(false);

    const clearTimers = useCallback(() => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    }, []);

    const finish = useCallback(() => {
        markSeen();
        setActive(false);
    }, []);

    const dismiss = useCallback(() => {
        if (exitingRef.current) return;
        exitingRef.current = true;
        clearTimers();
        setPhase('exiting');
        timers.current.push(setTimeout(finish, EXIT_MS + 50));
    }, [clearTimers, finish]);

    useEffect(() => {
        if (!active) return undefined;

        // Lock scroll while the curtain is up so the reveal feels intentional.
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const begin = () => {
            const pre = reduced.current ? 0 : PRE_MS;
            const enter = reduced.current ? 250 : ENTER_MS;
            const hold = reduced.current ? 150 : HOLD_MS;
            timers.current.push(setTimeout(() => setPhase('entering'), pre));
            timers.current.push(setTimeout(() => setPhase('holding'), pre + enter));
            timers.current.push(setTimeout(dismiss, pre + enter + hold));
        };

        // Gate the animation on the (large) logo actually decoding so it
        // never animates a half-loaded image. Fall back if decode is slow.
        let started = false;
        const startOnce = () => {
            // Bail if already started, or if the user already skipped during
            // the decode gate — otherwise a late decode would re-show the splash.
            if (started || exitingRef.current) return;
            started = true;
            begin();
        };

        const img = new Image();
        img.src = LOGO_SRC;
        if (img.decode) {
            img.decode().then(startOnce).catch(startOnce);
        } else {
            img.onload = startOnce;
            img.onerror = startOnce;
        }
        // Safety: never let a stalled decode strand a black screen.
        timers.current.push(setTimeout(startOnce, 1500));

        // Any key skips the intro (div onKeyDown won't fire without focus).
        window.addEventListener('keydown', dismiss);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', dismiss);
            clearTimers();
        };
    }, [active, dismiss, clearTimers]);

    if (!active) return null;

    const classes = [
        'splash-intro',
        `is-${phase}`,
        reduced.current ? 'is-reduced' : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classes}
            role="presentation"
            aria-hidden="true"
            onClick={dismiss}
            onWheel={dismiss}
            onTouchStart={dismiss}
        >
            <div className="splash-grain" />
            <div className="splash-logo-wrap">
                <img
                    className="splash-logo"
                    src={LOGO_SRC}
                    alt=""
                    decoding="async"
                    fetchpriority="high"
                    draggable="false"
                />
            </div>
            <span className="splash-skip">taste the corners of your mind</span>
        </div>
    );
}
