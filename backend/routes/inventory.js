const express = require('express');
const { Item } = require('../models');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const inventory = await Item.findAll();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch inventory', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch item', error: error.message });
    }
});

router.put('/', async (req, res) => {
    const updates = req.body; // Expecting an object: { itemId1: newStock1, itemId2: newStock2, ... }

    try {
        const updatePromises = Object.entries(updates).map(async ([id, newStock]) => {
            const item = await Item.findByPk(id);

            if (!item) {
                throw new Error(`Item with ID ${id} not found`);
            }

            item.stock = newStock;
            return item.save();
        });

        await Promise.all(updatePromises);

        res.json({ success: true, message: 'Stock values updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update stock', error: error.message });
    }
});

module.exports = router;