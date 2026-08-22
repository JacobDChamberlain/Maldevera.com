import React from 'react';
import StoreItem from './StoreItem/StoreItem';
import { CATEGORY_SECTIONS } from './categories';

// The classic category grid. Kept as its own component so it can serve as the
// fallback view when the 3D booth can't run (no WebGL) or the user prefers it.
export default function MerchGrid({ products }) {
    const knownKeys = CATEGORY_SECTIONS.map(s => s.key);
    const sections = [
        ...CATEGORY_SECTIONS,
        { key: '__other__', label: 'More' },
    ];

    return (
        <div className="merch-page">
            {sections.map(({ key, label }) => {
                const items = products.filter(p =>
                    key === '__other__' ? !knownKeys.includes(p.category) : p.category === key
                );
                if (items.length === 0) return null;

                return (
                    <section className="merch-section" key={key}>
                        <h2 className="merch-section-title">{label}</h2>
                        <ul className="merch-ul">
                            {items.map(product => (
                                <StoreItem key={product.id} product={product} />
                            ))}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}
