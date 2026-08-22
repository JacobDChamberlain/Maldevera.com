import { isRackProduct } from '../categories';

// Pure layout: turn the flat product list into positioned rack (hanging apparel)
// and table (everything else) items. Scales to any N by widening the rack /
// table span and wrapping onto a second rack row when there are many shirts.
//
// World units: table top sits at y=1.0, centered at origin; the grid-wall rack
// stands behind it. Returns arrays of { product, position: [x,y,z] }.

const RACK = {
    y: 1.95,       // hanging height (center of the garment)
    z: -0.7,       // just behind the table
    maxSpan: 7.4,  // total horizontal spread for a single row
    rowGap: 1.8,   // vertical gap if a second row is needed
    perRow: 5,     // shirts per rack row before wrapping up
};

const TABLE = {
    y: 1.0,        // table surface height
    z: 0.45,       // toward the front edge
    maxSpan: 7.6,
};

function spread(count, span) {
    if (count <= 1) return [0];
    const step = span / (count - 1);
    return Array.from({ length: count }, (_, i) => -span / 2 + i * step);
}

export default function useBoothLayout(products) {
    const rackProducts = products.filter(isRackProduct);
    const tableProducts = products.filter(p => !isRackProduct(p));

    // Rack: wrap into rows of RACK.perRow, newest rows stacked upward.
    const rackItems = rackProducts.map((product, i) => {
        const row = Math.floor(i / RACK.perRow);
        const rowCount = Math.min(RACK.perRow, rackProducts.length - row * RACK.perRow);
        const col = i % RACK.perRow;
        const xs = spread(rowCount, Math.min(RACK.maxSpan, rowCount * 1.4));
        return {
            product,
            position: [xs[col], RACK.y + row * RACK.rowGap, RACK.z],
        };
    });

    // Table: single row spread across the surface.
    const tableXs = spread(tableProducts.length, Math.min(TABLE.maxSpan, tableProducts.length * 1.5));
    const tableItems = tableProducts.map((product, i) => ({
        product,
        position: [tableXs[i], TABLE.y, TABLE.z],
    }));

    return { rackItems, tableItems };
}
