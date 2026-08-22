import React, { useEffect, useRef } from 'react';
import formatCurrency from '../../../../utilities/formatCurrency';
import { useProductPurchase } from '../useProductPurchase';

// Accessible detail panel shown when a booth item is clicked. Reuses the shared
// purchase hook so add-to-cart behaves exactly like the grid's StoreItem.
export default function ProductDetail({ product, onClose }) {
    const {
        hasSizes,
        availableSizes,
        sortedSizes,
        isSoldOut,
        minPrice,
        priceVaries,
        selectedSize,
        setSelectedSize,
        itemAdded,
        showAlert,
        setShowAlert,
        alertMessage,
        handleAddToCart,
    } = useProductPurchase(product);

    const dialogRef = useRef(null);
    const lastFocus = useRef(null);

    useEffect(() => {
        lastFocus.current = document.activeElement;
        const first = dialogRef.current?.querySelector('button, [tabindex]');
        first?.focus();

        const onKey = (e) => {
            if (e.key === 'Escape') { onClose(); return; }
            if (e.key === 'Tab') {
                const focusable = dialogRef.current?.querySelectorAll(
                    'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable || focusable.length === 0) return;
                const list = Array.from(focusable);
                const idx = list.indexOf(document.activeElement);
                if (e.shiftKey && (idx <= 0)) { e.preventDefault(); list[list.length - 1].focus(); }
                else if (!e.shiftKey && idx === list.length - 1) { e.preventDefault(); list[0].focus(); }
            }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            lastFocus.current?.focus?.();
        };
    }, [onClose]);

    const priceText = priceVaries ? `from ${formatCurrency(minPrice)}` : formatCurrency(minPrice);

    return (
        <div className="booth-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div
                className="booth-detail"
                role="dialog"
                aria-modal="true"
                aria-label={product.name}
                ref={dialogRef}
            >
                <div className="booth-detail-art">
                    {product.images && product.images[0]
                        ? <img src={product.images[0]} alt={product.name} crossOrigin="anonymous" />
                        : <div className="booth-detail-noart">{product.name}</div>}
                </div>

                <div className="booth-detail-body">
                    <div className="booth-detail-cat">{product.category}</div>
                    <h2 className="booth-detail-name">{product.name.toUpperCase()}</h2>
                    <div className="booth-detail-price">{priceText}</div>
                    {product.description && <p className="booth-detail-desc">{product.description}</p>}

                    {hasSizes && !isSoldOut && (
                        <>
                            <div className="booth-sizes-label">Select size</div>
                            <div className="booth-sizes">
                                {sortedSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`booth-size${selectedSize === size ? ' selected' : ''}`}
                                        disabled={availableSizes[size] === 0}
                                        onClick={() => { setSelectedSize(size); setShowAlert(false); }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="booth-msg" aria-live="polite">{showAlert ? alertMessage : ''}</div>

                    <div className="booth-actions">
                        <button
                            type="button"
                            className={`booth-add${itemAdded ? ' added' : ''}`}
                            disabled={isSoldOut}
                            onClick={handleAddToCart}
                        >
                            {isSoldOut ? 'Sold Out' : itemAdded ? 'Added 🤘' : 'Add to cart'}
                        </button>
                        <button type="button" className="booth-close" aria-label="Close" onClick={onClose}>✕</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
