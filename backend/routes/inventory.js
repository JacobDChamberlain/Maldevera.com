const express = require('express');
const { Variant, Product } = require('../models');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Flat, item-shaped view of a variant — keeps /api/inventory backwards
// compatible with the cart and the stock admin, which key off `id` and expect
// a size-suffixed `name`.
function toFlat(variant) {
    const product = variant.product;
    const baseName = product ? product.name : '';
    return {
        id: variant.id,
        product_id: variant.product_id,
        name: variant.size ? `${baseName} - ${variant.size}` : baseName,
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
        images: product ? product.images : [],
        description: product ? product.description : null,
        category: product ? product.category : null
    };
}

router.get('/', async (req, res) => {
    try {
        const variants = await Variant.findAll({
            where: { active: true },
            include: [{ model: Product, as: 'product' }],
            order: [['id', 'ASC']]
        });
        res.json(variants.map(toFlat));
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch inventory', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const variant = await Variant.findByPk(id, { include: [{ model: Product, as: 'product' }] });

        if (!variant) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.json(toFlat(variant));
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch item', error: error.message });
    }
});

router.put('/', requireAuth, async (req, res) => {
    const updates = req.body; // Expecting an object: { variantId1: newStock1, ... }

    try {
        const updatePromises = Object.entries(updates).map(async ([id, newStock]) => {
            const variant = await Variant.findByPk(id);

            if (!variant) {
                throw new Error(`Variant with ID ${id} not found`);
            }

            variant.stock = newStock;
            return variant.save();
        });

        await Promise.all(updatePromises);

        res.json({ success: true, message: 'Stock values updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update stock', error: error.message });
    }
});

module.exports = router;
