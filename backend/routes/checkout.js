const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sequelize, Item } = require('../models');
const router = express.Router();
const frontendBaseURL = process.env.FRONTEND_URL;

router.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body; // Expecting { items: [{ id, quantity }] }
    const purchasedItems = [];

    try {
        for (let item of items) {
            if (item.quantity < 1) {
                throw new Error("Invalid item quantity");
            }
        }

        for (const { id, quantity } of items) {
            const item = await Item.findByPk(id);

            if (!item || item.stock < quantity) {
                throw new Error(`Requested quantity not available for ${item ? item.name : 'Unknown item'}`);
            }

            purchasedItems.push({
                id: item.id,
                name: item.name,
                price: Math.round(item.price * 100), // Convert to cents for Stripe
                quantity
            });
        }

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
            customer_creation: 'always', // Ensure a customer is created or reused for this session
            metadata: {
                purchasedItems: JSON.stringify(purchasedItems), // Store items for use in webhook
            },
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'], // Adjust as needed
            },
            phone_number_collection: {
                enabled: true,
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
