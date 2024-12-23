const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    //* decrement inventory for each item/quantity bought by customer
    //* send confirmation email html to customer with item pics, quantity, description, and price breakdown, similar to Amazon or another online shopping store
    //* send email to us (MaldeveraTX@gmail.com) with customer info, items they bought, and their shipping address

    console.log('webhook received: ', req.body);

    res.send({"message": "webhook received"})
})


module.exports = router;