const express = require('express');
const { sequelize, Item } = require('../models');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async (req, res) => {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            const purchasedItems = JSON.parse(session.metadata.purchasedItems);

            // Update stock in a transaction
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

            // Extract customer details and shipping info
            const { name, email, phone, address } = session.customer_details;

            // Prepare email content for Maldevera
            const purchasedItemsDetails = purchasedItems.map(({ id, quantity }) =>
                `- Item ID: ${id}, Quantity: ${quantity}`
            ).join('\n');

            const maldeveraEmailContent = `
                New Purchase Notification:

                Customer Info:
                - Name: ${name}
                - Email: ${email}
                - Phone: ${phone}

                Shipping Address:
                ${address.line1}
                ${address.line2 || ''}
                ${address.city}, ${address.state} ${address.postal_code}
                ${address.country}

                Purchased Items:
                ${purchasedItemsDetails}
            `;

            // Configure Nodemailer
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Send email to Maldevera
            await transporter.sendMail({
                from: `"Maldevera Merch Store" ${process.env.EMAIL_USER}`,
                to: "MaldeveraTX@gmail.com",
                subject: "New Merch Purchase - Order Details",
                text: maldeveraEmailContent,
            });

            console.log("Email successfully sent to MaldeveraTX@gmail.com");

        } catch (error) {
            console.error('Error updating stock or sending emails:', error);
        }
    }

    return res.json({ received: true });
});

module.exports = router;
