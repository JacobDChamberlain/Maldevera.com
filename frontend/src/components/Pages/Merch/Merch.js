import React from 'react';
import StoreItem from './StoreItem/StoreItem';
import './Merch.css';
import { useInventory } from '../../../context/InventoryContext';

// Storefront section order + display labels. Anything with an unknown category
// falls through into "More".
const CATEGORY_SECTIONS = [
    { key: 'clothing', label: 'Apparel' },
    { key: 'music', label: 'Music' },
    { key: 'accessory', label: 'Accessories' },
];

export default function Merch() {
    const { products, loading } = useInventory();

    if (loading) {
        return <div className='merch-loading'>Loading...</div>;
    }

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
