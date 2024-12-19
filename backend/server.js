const express = require('express');
const cors = require('cors');
const { sequelize, Item } = require('./models'); // Import Sequelize instance and Item model
const app = express();
const port = process.env.PORT || 5001;
require('dotenv').config({ path: './.env'});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


app.use(express.json());
app.use(cors());


app.post('/create-checkout-session', async (req, res) => {
    const itemsToPurchase = req.body; // Expecting array of { id, quantity }
    const purchasedItems = [];

    try {
        // Validate item quantities
        for (let item of itemsToPurchase) {
            if (item.quantity < 1) {
                throw new Error("Invalid item quantity");
            }
        }

        // Use a transaction to ensure atomicity
        await sequelize.transaction(async (t) => {
            for (const { id, quantity } of itemsToPurchase) {
                const item = await Item.findByPk(id, { transaction: t });

                if (!item || item.stock < quantity) {
                    throw new Error(`Requested quantity not available for ${item ? item.name : 'Unknown item'}`);
                }

                // Decrement the item's stock
                item.stock -= quantity;
                await item.save({ transaction: t });

                // Add the item to the list of purchased items
                purchasedItems.push({
                    id: item.id,
                    name: item.name,
                    price: Math.round(item.price * 100),
                    quantity
                });
            }
        });

        // Create Stripe checkout session
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
            success_url: 'https://www.maldevera.com/successful-purchase',
            cancel_url: 'https://www.maldevera.com/sad-yeet',
        });

        // Respond with session URL
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error in /create-checkout-session:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});



// Endpoint to get inventory
app.get('/api/inventory', async (req, res) => {
    try {
        const inventory = await Item.findAll(); // Fetch all items from the database
        //* each time an item is purchased, it's moved to the end of the inventory.
        //* find out why, and fix it so the order stays the same.
        //* this is important to display the shirt sizes in the correct order on the frontend
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch inventory', error: error.message });
    }
});

// Endpoint to get an item by ID
app.get('/api/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByPk(id); // Find an item by its primary key (ID)

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch item', error: error.message });
    }
});

// Endpoint to decrement multiple item quantities
app.post('/api/purchase', async (req, res) => {
    const itemsToPurchase = req.body; // Array of objects { id, quantity }
    const purchasedItems = [];

    try {
        for ( let item of itemsToPurchase ) {
            if (item.quantity < 1 ) {
                throw new Error("Invalid item quantity");
            }
        }

        // Use a transaction to ensure atomicity
        await sequelize.transaction(async (t) => {
            for (const { id, quantity } of itemsToPurchase) {
                const item = await Item.findByPk(id, { transaction: t });

                if (!item || item.stock < quantity) {
                    throw new Error(`Requested quantity not available for ${item ? item.name : 'Unknown item'}`);
                }

                // Decrement the item's stock
                item.stock -= quantity;
                await item.save({ transaction: t });

                // Add the item to the list of purchased items
                purchasedItems.push({
                    id: item.id,
                    name: item.name,
                    quantity
                });
            }
        });

        // Return the list of purchased items
        res.status(200).json({ success: true, purchasedItems });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
