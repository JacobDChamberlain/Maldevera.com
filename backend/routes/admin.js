const express = require('express');
const { Product, Variant } = require('../models');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

const CATEGORIES = ['clothing', 'music', 'accessory'];

// All admin routes require a valid JWT.
router.use(requireAuth);

function slugify(name) {
    return String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Ensure the slug is unique, appending -2, -3, ... if needed.
async function uniqueSlug(base, excludeId = null) {
    let slug = base || 'item';
    let n = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const existing = await Product.findOne({ where: { slug } });
        if (!existing || existing.id === excludeId) return slug;
        n += 1;
        slug = `${base}-${n}`;
    }
}

function parsePrice(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
}

// --- List all products (incl. inactive) with all variants, for the admin ---
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Variant, as: 'variants' }],
            order: [
                ['sort_order', 'ASC'],
                ['id', 'ASC'],
                [{ model: Variant, as: 'variants' }, 'sort_order', 'ASC'],
                [{ model: Variant, as: 'variants' }, 'id', 'ASC']
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
    }
});

// --- Create a product (optionally with initial variants) ---
router.post('/products', async (req, res) => {
    const { name, category, description, images, active, featured, sort_order, variants } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: `Category must be one of: ${CATEGORIES.join(', ')}` });
    }

    try {
        const slug = await uniqueSlug(slugify(name));
        const product = await Product.create({
            name: name.trim(),
            slug,
            description: description || null,
            category,
            images: Array.isArray(images) ? images : [],
            active: active !== undefined ? !!active : true,
            featured: !!featured,
            sort_order: Number.isInteger(sort_order) ? sort_order : 0
        });

        // Optional initial variants
        if (Array.isArray(variants) && variants.length) {
            for (const v of variants) {
                const price = parsePrice(v.price);
                if (price === null) {
                    return res.status(400).json({ success: false, message: `Invalid price for a variant of "${name}"` });
                }
                await Variant.create({
                    product_id: product.id,
                    size: v.size || null,
                    price,
                    stock: Number.isInteger(v.stock) ? v.stock : 0,
                    active: v.active !== undefined ? !!v.active : true,
                    sort_order: Number.isInteger(v.sort_order) ? v.sort_order : 0
                });
            }
        }

        const withVariants = await Product.findByPk(product.id, {
            include: [{ model: Variant, as: 'variants' }]
        });
        res.status(201).json(withVariants);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
    }
});

// --- Update a product (partial) ---
router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, description, images, active, featured, sort_order, slug } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (category !== undefined && !CATEGORIES.includes(category)) {
            return res.status(400).json({ success: false, message: `Category must be one of: ${CATEGORIES.join(', ')}` });
        }

        if (name !== undefined) product.name = name.trim();
        if (category !== undefined) product.category = category;
        if (description !== undefined) product.description = description;
        if (images !== undefined) product.images = Array.isArray(images) ? images : [];
        if (active !== undefined) product.active = !!active;
        if (featured !== undefined) product.featured = !!featured;
        if (sort_order !== undefined && Number.isInteger(sort_order)) product.sort_order = sort_order;
        if (slug !== undefined && slug.trim()) product.slug = await uniqueSlug(slugify(slug), product.id);

        await product.save();

        const updated = await Product.findByPk(product.id, {
            include: [{ model: Variant, as: 'variants' }]
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
    }
});

// --- Delete a product (cascades to its variants via FK) ---
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await product.destroy();
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
    }
});

// --- Add a variant to a product ---
router.post('/products/:id/variants', async (req, res) => {
    const { id } = req.params;
    const { size, price, stock, active, sort_order } = req.body;

    const parsedPrice = parsePrice(price);
    if (parsedPrice === null) {
        return res.status(400).json({ success: false, message: 'A valid price is required' });
    }

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variant = await Variant.create({
            product_id: product.id,
            size: size || null,
            price: parsedPrice,
            stock: Number.isInteger(stock) ? stock : 0,
            active: active !== undefined ? !!active : true,
            sort_order: Number.isInteger(sort_order) ? sort_order : 0
        });

        res.status(201).json(variant);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add variant', error: error.message });
    }
});

// --- Update a variant (partial: size, price, stock, active) ---
router.put('/variants/:id', async (req, res) => {
    const { id } = req.params;
    const { size, price, stock, active, sort_order } = req.body;

    try {
        const variant = await Variant.findByPk(id);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        if (price !== undefined) {
            const parsedPrice = parsePrice(price);
            if (parsedPrice === null) {
                return res.status(400).json({ success: false, message: 'Invalid price' });
            }
            variant.price = parsedPrice;
        }
        if (size !== undefined) variant.size = size || null;
        if (stock !== undefined && Number.isInteger(stock)) variant.stock = stock;
        if (active !== undefined) variant.active = !!active;
        if (sort_order !== undefined && Number.isInteger(sort_order)) variant.sort_order = sort_order;

        await variant.save();
        res.json(variant);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update variant', error: error.message });
    }
});

// --- Delete a variant ---
router.delete('/variants/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const variant = await Variant.findByPk(id);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }
        await variant.destroy();
        res.json({ success: true, message: 'Variant deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete variant', error: error.message });
    }
});

module.exports = router;
