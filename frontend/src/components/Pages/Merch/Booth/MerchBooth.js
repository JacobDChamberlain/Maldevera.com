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

    // View preference, persisted. Booth is the default; forced to grid without WebGL.
    const [view, setView] = useState(() => {
        if (!webglOK) return 'grid';
        return localStorage.getItem('merch-view') || 'booth';
    });
    useEffect(() => {
        if (webglOK) localStorage.setItem('merch-view', view);
    }, [view, webglOK]);

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
            onClick={() => setView(showBooth ? 'grid' : 'booth')}
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
                                    walking) so drei's click-to-lock listener stays attached. */}
                                <button
                                    id="booth-explore"
                                    type="button"
                                    className={`booth-explore${locked || selectedProduct ? ' hidden' : ''}`}
                                >
                                    <span className="booth-explore-play">▶</span>
                                    <span className="booth-explore-title">Enter the booth</span>
                                    <span className="booth-explore-keys">WASD / arrows to walk · mouse to look · Esc to release</span>
                                </button>
                                {locked && !talking && <div className="booth-reticle" aria-hidden="true" />}
                            </>
                        ) : (
                            <div className="booth-hint">drag to orbit · scroll to zoom · drag sideways to pan · tap an item</div>
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
