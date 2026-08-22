import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useInventory } from '../../../../context/InventoryContext';
import { useTheme } from '../../../../context/ThemeContext';
import { getBoothTheme } from './boothTheme';
import hasWebGL from '../../../../utilities/hasWebGL';
import MerchGrid from '../MerchGrid';
import ProductDetail from './ProductDetail';
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

    const openProduct = (p) => { boothAudio.resume(); boothAudio.pickup(); setSelectedProduct(p); };
    const closeProduct = () => { boothAudio.putdown(); setSelectedProduct(null); };

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
                                onLockChange={setLocked}
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
                                {locked && <div className="booth-reticle" aria-hidden="true" />}
                            </>
                        ) : (
                            <div className="booth-hint">drag to orbit · scroll to zoom · drag sideways to pan · tap an item</div>
                        )}
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
