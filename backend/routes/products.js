const express = require('express');
const { Product, Variant } = require('../models');
const router = express.Router();

// Storefront feed: active products with their active variants nested in.
// Replaces the old runtime name-splitting — grouping is now the data model.
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { active: true },
            include: [{
                model: Variant,
                as: 'variants',
                where: { active: true },
                required: false
            }],
            order: [
                ['sort_order', 'ASC'],
                ['id', 'ASC'],
                [{ model: Variant, as: 'variants' }, 'sort_order', 'ASC']
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
    }
});

module.exports = router;
