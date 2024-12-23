const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


router.post('/', async (req, res) => {
    //* decrement inventory for each item/quantity bought by customer
    //* send confirmation email html to customer with item pics, quantity, description, and price breakdown, similar to Amazon or another online shopping store
    //* send email to us (MaldeveraTX@gmail.com) with customer info, items they bought, and their shipping address

    const event = req.body;

    //* checkout.session.completed --> RESPOND TO THIS


    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("***Checkout Session Object: ", session);

        console.log("Customer Details: ", session.customer_details);

    }

    return res.json({ received: true });
})


module.exports = router;