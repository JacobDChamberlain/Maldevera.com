const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sequelize, Item } = require('../models');
const router = express.Router();
const frontendBaseURL = process.env.FRONTEND_URL;


router.post('/create-checkout-session', async (req, res) => {
    const { items, customerInfo } = req.body; // Expecting { items: [{ id, quantity }], customerInfo: {...} }
    const purchasedItems = [];

    try {
        // Validate item quantities
        for (let item of items) {
            if (item.quantity < 1) {
                throw new Error("Invalid item quantity");
            }
        }

        // Use a transaction to ensure atomicity
        await sequelize.transaction(async (t) => {
            for (const { id, quantity } of items) {
                const item = await Item.findByPk(id, { transaction: t });

                if (!item || item.stock < quantity) {
                    throw new Error(`Requested quantity not available for ${item ? item.name : 'Unknown item'}`);
                }

                item.stock -= quantity;
                await item.save({ transaction: t });

                purchasedItems.push({
                    id: item.id,
                    name: item.name,
                    price: Math.round(item.price * 100), // Convert to cents for Stripe
                    quantity
                });
            }
        });

        const lineItems = purchasedItems.map(({ name, quantity, price }) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name,
                },
                unit_amount: price,
            },
            quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerInfo.email, // Associate email with session
            metadata: {
                customerName: customerInfo.name,
                address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}, ${customerInfo.zip}`,
                purchasedItems: JSON.stringify(purchasedItems), // Optionally store purchased items
            },
            success_url: `${frontendBaseURL}/successful-purchase`,
            cancel_url: `${frontendBaseURL}/sad-yeet`,
        });

        // Send user to Stripe page to enter card info
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error in /create-checkout-session:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});


module.exports = router;