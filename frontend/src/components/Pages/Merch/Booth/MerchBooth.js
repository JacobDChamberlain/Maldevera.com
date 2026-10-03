import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useInventory } from '../../../../context/InventoryContext';
import { useTheme } from '../../../../context/ThemeContext';
import { getBoothTheme } from './boothTheme';
import hasWebGL from '../../../../utilities/hasWebGL';
import MerchGrid from '../MerchGrid';
import ProductDetail from './ProductDetail';
import BoothDialogue from './BoothDialogue';
import * as boothAudio from './boothAudio';
import './booth.css';

const Booth3D = lazy(() => import('./Booth3D'));

// What you can actually do in here. This used to be a single hardcoded line
// that mentioned walking and looking and nothing else, so E, space and shift
// went undiscovered — they've all worked in WalkControls the whole time.
const WALK_CONTROLS = [
    ['WASD / arrows', 'walk'],
    ['mouse', 'look'],
    ['E or click', 'pick up / talk'],
    ['space', 'jump'],
    ['shift', 'crouch'],
    ['esc', 'exit'],
];
const ORBIT_CONTROLS = [
    ['drag', 'look around'],
    ['pinch or scroll', 'zoom'],
    ['two fingers', 'pan'],
    ['tap an item', 'open it'],
];

function ControlList({ controls, className }) {
    return (
        <dl className={className}>
            {controls.map(([input, does]) => (
                <div className="booth-control" key={input}>
                    <dt>{input}</dt>
                    <dd>{does}</dd>
                </div>
            ))}
        </dl>
    );
}

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia(query).matches
    );
    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [query]);
    return matches;
}

export default function MerchBooth() {
    const { products, loading } = useInventory();
    const { theme } = useTheme();
    const boothTheme = getBoothTheme(theme);

    const webglOK = hasWebGL();
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const isMobile = useMediaQuery('(max-width: 768px)');

    // View preference, persisted. The grid is the default now and the booth is
    // something you choose. New storage key on purpose: the old one was written
    // on every mount, so every past visitor has 'booth' saved whether they ever
    // chose it or not — reusing it would hand them a default they never picked.
    const [view, setView] = useState(() => {
        if (!webglOK) return 'grid';
        return localStorage.getItem('merch-view-2') || 'grid';
    });
    // Only an actual choice is written, so the stored value means something.
    const chooseView = useCallback((next) => {
        setView(next);
        if (webglOK) localStorage.setItem('merch-view-2', next);
    }, [webglOK]);

    // The touch intro card, dismissed by tapping it. Not persisted — it's the
    // only place the orbit controls are spelled out, and it costs one tap.
    const [introDone, setIntroDone] = useState(false);
    const dismissIntro = useCallback(() => { boothAudio.resume(); setIntroDone(true); }, []);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [locked, setLocked] = useState(false);
    // Talking to the figure at the back of the room. Unlike a product panel this
    // doesn't pause the game — you stay locked in and can walk off mid-sentence.
    const [talking, setTalking] = useState(false);

    const openProduct = (p) => {
        boothAudio.resume();
        boothAudio.pickup();
        setTalking(false);
        setSelectedProduct(p);
    };
    const closeProduct = () => { boothAudio.putdown(); setSelectedProduct(null); };
    const startTalking = useCallback(() => { boothAudio.resume(); setTalking(true); }, []);
    const stopTalking = useCallback(() => setTalking(false), []);
    // Esc releases the mouse, and hitting Esc to get out of a conversation is
    // the natural move — so losing the lock ends it too.
    const handleLockChange = useCallback((isLocked) => {
        setLocked(isLocked);
        if (!isLocked) setTalking(false);
    }, []);

    if (loading) return <div className="merch-loading">Loading...</div>;

    const showBooth = webglOK && view === 'booth';
    // First-person walk on desktop; phones keep drag-to-orbit.
    const walkMode = showBooth && !isMobile;

    const toggleButton = webglOK && (
        <button
            type="button"
            className="booth-toggle"
            onClick={() => chooseView(showBooth ? 'grid' : 'booth')}
        >
            {showBooth ? 'Grid view' : 'Enter the booth'}
        </button>
    );

    return (
        <div className="merch-page">
            {showBooth ? (
                products.length === 0 ? (
                    <div className="booth-empty">The booth is being restocked — check back soon.</div>
                ) : (
                    <div className="booth-stage">
                        {toggleButton}
                        <Suspense fallback={<div className="booth-loading">entering the booth…</div>}>
                            <Booth3D
                                products={products}
                                theme={boothTheme}
                                reducedMotion={reducedMotion}
                                isMobile={isMobile}
                                onSelect={openProduct}
                                walkMode={walkMode}
                                paused={!!selectedProduct}
                                onLockChange={handleLockChange}
                                talking={talking}
                                onTalk={startTalking}
                                onTalkEnd={stopTalking}
                            />
                        </Suspense>

                        {walkMode ? (
                            <>
                                {/* pointer-lock trigger + how-to. Kept mounted (just hidden when
                                    walking) so drei's click-to-lock listener stays attached, and
                                    #booth-explore is the selector WalkControls matches clicks on —
                                    the id has to survive any restyling of this card. */}
                                <button
                                    id="booth-explore"
                                    type="button"
                                    className={`booth-explore${locked || selectedProduct ? ' hidden' : ''}`}
                                >
                                    <span className="booth-explore-play">▶</span>
                                    <span className="booth-explore-title">Enter the booth</span>
                                    <span className="booth-explore-sub">click to look around</span>
                                    <ControlList controls={WALK_CONTROLS} className="booth-controls-list" />
                                </button>
                                {locked && !talking && <div className="booth-reticle" aria-hidden="true" />}
                                {/* the card is gone once you're walking, so the controls stay
                                    readable in the corner instead of vanishing with it */}
                                {locked && !talking && (
                                    <ControlList controls={WALK_CONTROLS} className="booth-legend" />
                                )}
                            </>
                        ) : (
                            <>
                                {/* touch/orbit got no intro card at all before — just a thin line
                                    of text along the bottom edge. */}
                                {!introDone && (
                                    <button
                                        type="button"
                                        className="booth-explore"
                                        onClick={dismissIntro}
                                    >
                                        <span className="booth-explore-play">▶</span>
                                        <span className="booth-explore-title">The booth</span>
                                        <span className="booth-explore-sub">tap to start looking around</span>
                                        <ControlList controls={ORBIT_CONTROLS} className="booth-controls-list" />
                                    </button>
                                )}
                                {introDone && (
                                    <ControlList controls={ORBIT_CONTROLS} className="booth-legend" />
                                )}
                            </>
                        )}

                        {talking && <BoothDialogue onClose={stopTalking} />}
                    </div>
                )
            ) : (
                <>
                    <div className="booth-controls">{toggleButton}</div>
                    <MerchGrid products={products} />
                </>
            )}

            {selectedProduct && (
                <ProductDetail product={selectedProduct} onClose={closeProduct} />
            )}
        </div>
    );
}
