const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    //* decrement inventory for each item/quantity bought by customer
    //* send confirmation email html to customer with item pics, quantity, description, and price breakdown, similar to Amazon or another online shopping store
    //* send email to us (MaldeveraTX@gmail.com) with customer info, items they bought, and their shipping address

    const event = req.body;

    console.log("*~*~*event: *~*~* ", event);
    //* charge.succeeded
    //* checkout.session.completed
    //* payment_intent.succeeded --> paymentIntent.amount_received = 699 for $6.99 item (test again with multiple, confirm if this is total)
    //* payment_intent.created
    //* charge.updated
    //? All the above events were received when completing a purchase in test mode.
    //? which should I respond to to update my db/decrement item quantities, to send a confirmation email to the customer with item data pics and a brice breakdown, and send an email to use (MaldeveraTX@gmail.com) with the cusomter invoice and shipping data?

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log("webhook received => paymentIntent: ", paymentIntent);
            //* Then define and call a method to handle the successful payment intent.
            //* handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log("webhook received => paymentMethod: ", paymentMethod);
            //* Then define and call a method to handle the successful attachment of a PaymentMethod.
            //* handlePaymentMethodAttached(paymentMethod);
            //? why would i need to do this?
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
})


module.exports = router;