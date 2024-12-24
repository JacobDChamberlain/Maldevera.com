const express = require('express');
const { sequelize, Item } = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            const purchasedItems = JSON.parse(session.metadata.purchasedItems);

            await sequelize.transaction(async (t) => {
                for (const { id, quantity } of purchasedItems) {
                    const item = await Item.findByPk(id, { transaction: t });

                    if (!item) {
                        throw new Error(`Item with ID ${id} not found`);
                    }

                    item.stock -= quantity;
                    await item.save({ transaction: t });
                }
            });

            console.log("Stock successfully updated for purchased items.");

            //* TODO: Send confirmation email to the customer
            console.log("Customer Details: ", session.customer_details);
            // (Add your email sending handler call here)

            //* TODO: Send email to Maldevera with order details
            console.log("Sending email to MaldeveraTX@gmail.com...");
            // (Add your email sending handler call here)

        } catch (error) {
            console.error('Error updating stock or sending emails:', error);
        }
    }

    return res.json({ received: true });
});

module.exports = router;
