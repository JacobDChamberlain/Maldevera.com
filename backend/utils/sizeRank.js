// Rank a size label so variants sort smallest -> largest.
//
// `size` is a free-text field in the admin panel, so this has to cope with
// every way a 5XL might get typed ("5X", "5XL", "XXXXXL") rather than matching
// a fixed list. Kept in step with the frontend's sizeRank in
// frontend/src/components/Pages/Merch/useProductPurchase.js.

const BASE_RANK = { XS: 0, S: 1, M: 2, L: 3 };
const WORD_ALIASES = {
    EXTRASMALL: 'XS', XSMALL: 'XS', SMALL: 'S',
    MEDIUM: 'M', MED: 'M', LARGE: 'L',
    EXTRALARGE: 'XL', XLARGE: 'XL',
};

// Unknown labels sort after every recognized size, but stay well inside a
// 32-bit int so they're safe to store in variants.sort_order.
const UNKNOWN_RANK = 999;

function sizeRank(size) {
    const key = String(size || '').toUpperCase().replace(/[\s._-]/g, '');
    const alias = WORD_ALIASES[key] || key;
    if (alias in BASE_RANK) return BASE_RANK[alias];
    // "XL", "XXL", "XXXL", ... -> the X count is the multiplier
    const repeated = alias.match(/^(X+)L$/);
    if (repeated) return BASE_RANK.L + repeated[1].length;
    // "2X", "2XL", "5X", "5XL", ... -> the leading number is the multiplier
    const numeric = alias.match(/^(\d+)XL?$/);
    if (numeric) return BASE_RANK.L + Number(numeric[1]);
    return UNKNOWN_RANK;
}

module.exports = { sizeRank, UNKNOWN_RANK };
