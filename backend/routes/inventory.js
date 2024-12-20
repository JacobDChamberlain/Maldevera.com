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

module.exports = router;