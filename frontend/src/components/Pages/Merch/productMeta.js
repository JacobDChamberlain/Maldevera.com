import formatCurrency from '../../../utilities/formatCurrency';

// Pure, hook-free product display facts (price label, sold-out) for the booth's
// 3D items and tooltips. The interactive add-to-cart logic lives in
// useProductPurchase; this is just for display.
export function getProductMeta(product) {
    const variants = product.variants || [];
    const hasSizes = variants.some(v => v.size);
    const isSoldOut = variants.length === 0 || variants.every(v => v.stock === 0);
    const prices = variants.map(v => Number(v.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const priceVaries = prices.some(p => p !== minPrice);
    return { hasSizes, isSoldOut, minPrice, priceVaries };
}

export function priceLabel(meta) {
    return (meta.priceVaries ? 'from ' : '') + formatCurrency(meta.minPrice);
}
