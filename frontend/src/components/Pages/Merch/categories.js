// Storefront section order + display labels. Anything with an unknown category
// falls through into "More". Shared by the grid and the 3D booth so both agree
// on how products are grouped.
export const CATEGORY_SECTIONS = [
    { key: 'clothing', label: 'Apparel' },
    { key: 'music', label: 'Music' },
    { key: 'accessory', label: 'Accessories' },
];

// Which products hang on the grid-wall rack vs. sit on the booth table.
export const RACK_CATEGORIES = ['clothing'];

export function isRackProduct(product) {
    return RACK_CATEGORIES.includes(product.category);
}
