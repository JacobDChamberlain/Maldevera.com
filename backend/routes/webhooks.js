const express = require('express');
const { sequelize, Item } = require('../models');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async (req, res) => {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Parse purchased items from session metadata
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
            const { name, email, phone } = session.customer_details;
            const { line1, line2, city, state, postal_code, country } = session.customer_details.address;

            console.log("Customer Details: ", session.customer_details);
            console.log("Session object: ", session);

            // Prepare email content for Maldevera
            const purchasedItemsDetails = async (purchasedItems) => {
                let totalPrice = 0;

                const itemDetails = await Promise.all(
                    purchasedItems.map(async ({ id, quantity }) => {
                        const item = await Item.findByPk(id);

                        if (!item) {
                            throw new Error(`Item with ID ${id} not found`);
                        }

                        const itemTotal = parseFloat(item.price) * quantity;
                        totalPrice += itemTotal;

                        return `
                            <tr>
                                <td>${item.name}</td>
                                <td><img src='${item.images[0] || "No Image Available"}' alt='${item.name}' width='100'/></td>
                                <td>$${parseFloat(item.price).toFixed(2)}</td>
                                <td>${quantity}</td>
                            </tr>
                        `;
                    })
                );

                return `
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Picture</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemDetails.join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" align="right"><strong>Total Price:</strong></td>
                                <td><strong>$${totalPrice.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                `;
            };


            const purchasedItemsFormattedDetails = await purchasedItemsDetails(purchasedItems);
            const maldeveraEmailContent = `
                <h1>New Purchase Notification</h1>
                <h2>Customer Info:</h2>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
                </ul>
                <h2>Shipping Address:</h2>
                <p>${line1}<br/>${line2 || ''}<br/>${city}, ${state} ${postal_code}<br/>${country}</p>
                <h2>Purchased Items:</h2>
                ${purchasedItemsFormattedDetails}
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
                from: `"Maldevera Merch Store" <${process.env.EMAIL_USER}>`,
                to: "MaldeveraTX@gmail.com",
                subject: "New Merch Purchase - Order Details",
                html: maldeveraEmailContent,
            });

            console.log("Email successfully sent to MaldeveraTX@gmail.com");

        } catch (error) {
            console.error('Error updating stock or sending emails:', error);
        }
    }

    return res.json({ received: true });
});

module.exports = router;
